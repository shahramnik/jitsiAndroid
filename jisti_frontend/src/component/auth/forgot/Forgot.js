import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./forgot.css";
import config from "../../../util/config";

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class Forgot extends Component {
  baseUrl = config.serverAddress;
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      errors: {
        email: "",
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
        }),
      };
      fetch(this.baseUrl + "user/forgetPassword", requestOptions)
        .then((res) => res.json())
        .then((response) => {
          if (response.responseCode === 1) {
            localStorage.clear();
            localStorage.setItem("email", this.state.email);
            push("/changePassword");
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
        <div className="forgot-wrappers">
          <h2>Forgot Password</h2>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="email">
              <label className="forgotLabel" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                style={{ height: "33px", width: "100%" }}
                onChange={(e) => this.setState({ email: e.target.value })}
                placeholder="Enter Email"
                noValidate
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </div>
            {/* <div className="info">
              <small>Password must be eight characters in length.</small>
            </div> */}
            <div className="submit">
              <button className="btn btn-primary btn-sm">Submit</button>
            </div>
            <p className="forgot-password text-right">
              <a href="login">Already have an account?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Forgot);
