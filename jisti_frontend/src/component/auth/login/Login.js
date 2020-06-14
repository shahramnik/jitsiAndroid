import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./login.css";
import config from "../../../util/config";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class Login extends Component {
  baseUrl = config.serverAddress;
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      errors: {
        email: "",
        password: "",
      },
    };
  }

  handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;
    switch (name) {
      case "email":
        errors.email = validEmailRegex.test(value) ? "" : "Email is not valid!";
        break;
      case "password":
        errors.password =
          value.length < 5 ? "Password must be 5 characters long!" : "";
        break;
      default:
        break;
    }

    this.setState({ errors, [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {
      history: { push },
    } = this.props;

    if (validateForm(this.state.errors)) {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.state.email,
          password: this.state.password,
        }),
      };
      fetch(this.baseUrl + "user/adminLogin", requestOptions)
        .then((res) => res.json())
        .then((response) => {
          if (response.responseCode === 1) {
            localStorage.setItem("token", response.user_info.token);
            localStorage.setItem("fullName", response.user_info.full_name);
            if (response.user_info.role_id === 1) {
              push("/dashboard");
            }
          } else {
          }
        });
    } else {
      console.error("Invalid Form");
    }
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="wrapper">
        <div className="form-wrappers">
          <h2>Sign In</h2>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="email">
              <label className="emailAndPassword" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                onChange={(e) => this.setState({ email: e.target.value })}
                // onChange={this.handleChange}
                placeholder="Enter Email"
                noValidate
                style={{ height: "33px", width: "100%" }}
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </div>
            <div className="password">
              <label className="emailAndPassword" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                style={{ height: "33px", width: "100%" }}
                onChange={this.handleChange}
                noValidate
              />
              {errors.password.length > 0 && (
                <span className="error">{errors.password}</span>
              )}
            </div>
            {/* <div className="info">
              <small>Password must be eight characters in length.</small>
            </div> */}
            <div className="submit" style={{ marginBottom: "15px" }}>
              <button className="btn btn-primary btn-sm">Submit</button>
            </div>
            <p className="forgot-password text-right">
              <a href="/forgot">Forgot Password?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
