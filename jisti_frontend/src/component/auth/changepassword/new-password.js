import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./newpassword.css";
import config from '../../../util/config';

const validEmailRegex = RegExp(
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => val.length > 0 && (valid = false));
  return valid;
};

class NewPassword extends Component {
  baseUrl = config.serverAddress;
  constructor(props) {
    super(props);
    this.state = {
      otp: null,
      email: null,
      password: null,
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
      case "fullName":
        errors.fullName =
          value.length < 5 ? "Full Name must be 5 characters long!" : "";
        break;
      case "password":
        errors.password =
          value.length < 8 ? "Password must be 8 characters long!" : "";
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
          email: localStorage.getItem("email"),
          new_password: this.state.password,
          otp: this.state.otp,
        }),
      };
      fetch(this.baseUrl + "user/confirmForgetPassword", requestOptions)
        .then((res) => res.json())
        .then((response) => {
          console.log(response);
          if (response.responseCode === 1) {
            localStorage.clear();
            push("/login");
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
        <div className="change-pasword-wrappers">
          <h2>Create New Password</h2>
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="email">
              <label className="emailAndPassword" htmlFor="email">
                Enter OTP
              </label>
              <input
                type="number"
                style={{ height: "33px", width: "100%" }}
                onChange={(e) => this.setState({ otp: e.target.value })}
                placeholder="Enter 6 Digit Code Sent To Your Email"
                noValidate
              />
              {errors.email.length > 0 && (
                <span className="error">{errors.email}</span>
              )}
            </div>

            <div className="password">
              <label className="emailAndPassword" htmlFor="email">
                New Password
              </label>
              <input
                type="password"
                style={{ height: "33px", width: "100%" }}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="Enter New Password"
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
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(NewPassword);
