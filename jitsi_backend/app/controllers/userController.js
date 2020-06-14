const db = require("../models");
const nodemailer = require("nodemailer");
const macaddress = require("macaddress");
const User = db.tbl_users;
const userLoginDetails = db.tbl_user_login_details;

const crypto = require("crypto");
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const bcrypt = require("bcrypt");
const saltRounds = 8;

let emailInfo;
let otp;
exports.create = async (req, res) => {
  otp = randomNumber();
  const user = {
    full_name: req.body.full_name,
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, saltRounds),
    email_verification_code: otp,
    role_id: 2,
    status: 1,
  };
  db.sequelize
    .query(
      "SELECT user_id, full_name, email FROM tbl_users WHERE email = (:email)",
      {
        replacements: {
          email: req.body.email,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((resp) => {
      if (!resp.length) {
        if (req.body.role_id != 1) {
          User.create(user)
            .then((userData) => {
              dataToSend = {
                user_id: userData.user_id,
                full_name: userData.full_name,
                email: userData.email,
                role_id: userData.role_id,
                status: userData.status,
                updatedAt: userData.updatedAt,
                createdAt: userData.createdAt,
              };

              res.status(200).json({
                responseCode: 1,
                message: "Otp Sent to your mail",
                data: dataToSend,
              });
              mailSend(userData.email, userData.email_verification_code);
            })
            .catch((err) => {
              res.status(500).send({
                message: err || "Error occured",
              });
            });
        } else {
          res.status(200).json({
            responseCode: 0,
            message: "Not authorized",
          });
        }
      } else {
        res.status(200).json({
          responseCode: 0,
          message: "Email already exist",
        });
      }
    });
};

exports.getUserProfile = (req, res) => {
  var getUserProfileInfo = {
    user: "",
    user_login_detail: "",
  };
  if (
    req.headers.user_login_token == null ||
    req.headers.user_login_token == undefined
  ) {
    res.status(200).json({
      responseCode: 0,
      message: "you are not authorized to access these",
    });
  } else {
    var query = db.sequelize
      .query(
        "SELECT * from tbl_user_login_details WHERE user_login_token = (:user_login_token)",
        {
          replacements: {
            user_login_token: req.headers.user_login_token,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      )
      .then((userDetailInfo) => {
        if (userDetailInfo.length == 1) {
          getUserProfileInfo.user_login_detail = userDetailInfo[0];
          var query = db.sequelize
            .query(
              "SELECT user_id, role_id, full_name, email, phone_number, email_verify_date, country_id, state_id, city_id, post_code, date_of_birth, user_lat, user_long, user_image_1, user_image_2, remark from tbl_users WHERE user_id = (:user_id)",
              {
                replacements: {
                  user_id: userDetailInfo[0].user_id,
                },
                type: db.sequelize.QueryTypes.SELECT,
              }
            )
            .then((userInfo) => {
              // user if and else
              getUserProfileInfo.user = userInfo[0];
              res.status(200).json({
                responseCode: 1,
                message: "user Profile Data",
                userInfo: getUserProfileInfo,
              });
            });
        } else {
          res.status(200).json({
            responseCode: 0,
            message: "You are not able to authorized these",
          });
        }
      });
  }
};

exports.getUserList = (req, res) => {
  let status = req.params.status;
  if (
    req.headers.user_login_token == null ||
    req.headers.user_login_token == undefined
  ) {
    res.status(200).json({
      responseCode: 0,
      message: "You are not authorized to acess these",
    });
  }

  var query = db.sequelize
    .query(
      "SELECT * from tbl_user_login_details WHERE user_login_token = (:user_login_token)",
      {
        replacements: {
          user_login_token: req.headers.user_login_token,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((userDetailInfo) => {
      if (userDetailInfo.length == 0) {
        res.status(200).json({
          responseCode: 0,
          message: "You are not authorized to acess these",
        });
      } else {
        var query = db.sequelize
          .query("SELECT role_id from tbl_users WHERE user_id = (:user_id)", {
            replacements: {
              user_id: userDetailInfo[0].user_id,
            },
            type: db.sequelize.QueryTypes.SELECT,
          })
          .then((userInfo) => {
            if (userInfo[0].role_id == 1) {
              if (status == 2) {
                User.findAll({
                  where: { role_id: 2 },
                  attributes: [
                    "user_id",
                    "full_name",
                    "email",
                    "status",
                    "createdAt",
                    "updatedAt",
                  ],
                }).then((response) => {
                  res.status(200).json({
                    responseCode: 1,
                    message: "Users list",
                    data: response,
                  });
                });
              } else {
                User.findAll({
                  where: { status: status, role_id: 2 },
                  attributes: [
                    "user_id",
                    "full_name",
                    "email",
                    "status",
                    "password",
                    "createdAt",
                    "updatedAt",
                  ],
                }).then((response) => {
                  res.status(200).json({
                    responseCode: 1,
                    message: "Users list",
                    data: response,
                  });
                });
              }
            } else {
              res.status(200).json({
                responseCode: 0,
                message: "You are not authorized to acess these",
              });
            }
          });
      }
    });
};

exports.getUserListing = (req, res) => {
  if (
    req.headers.user_login_token == null ||
    req.headers.user_login_token == undefined
  ) {
    return res.status(400).send({
      responseCode: 0,
      message: "not Authorised",
    });
  }
  let status = req.params.status;

  userLoginDetails
    .findOne({
      where: { user_login_token: req.headers.user_login_token },
    })
    .then((response) => {
      User.findOne({
        where: { user_id: response.user_id },
      })
        .then((response) => {
          console.log("response");
          console.log(response);
          if (response.role_id == 2) {
            return res.status(200).json({
              responseCode: 0,
              message: "not Authorised",
            });
          } else {
            if (status == 2) {
              User.findAll({
                where: { role_id: 2 },
                attributes: [
                  "user_id",
                  "full_name",
                  "email",
                  "status",
                  "password",
                  "createdAt",
                  "updatedAt",
                ],
              })
                .then((response) => {
                  return res.status(200).send({
                    responseCode: 1,
                    message: "success",
                    data: response,
                  });
                })
                .catch((err) => {
                  return res.status(400).send({
                    responseCode: 0,
                    message: "no Record Found1",
                    data: null,
                  });
                });
            } else {
              User.findAll({
                where: { status: status, role_id: 2 },
                attributes: [
                  "user_id",
                  "full_name",
                  "email",
                  "status",
                  "password",
                  "createdAt",
                  "updatedAt",
                ],
              })
                .then((response) => {
                  return res.status(200).send({
                    responseCode: 1,
                    message: "success",
                    data: response,
                  });
                })
                .catch((err) => {
                  return res.status(400).send({
                    responseCode: 0,
                    message: "no Record Found2",
                    data: null,
                  });
                });
            }
          }
        })
        .catch((err) => {
          return res.status(400).json({
            responseCode: 0,
            message: "no Record Found34",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        responseCode: 0,
        message: "no Record Found",
      });
    });
};

exports.updateUserInfo = (req, res) => {
  console.log(req.body);
  if (
    req.headers.user_login_token == null ||
    req.headers.user_login_token == undefined ||
    req.headers.user_login_token == ""
  ) {
    res.status(200).json({
      responseCode: 0,
      message: "You are not authorized to access these",
    });
  }
  userLoginDetails
    .findOne({
      where: { user_login_token: req.headers.user_login_token },
    })
    .then((response) => {
      if (response != null) {
        userid = response.user_id;
        User.findOne({
          where: { user_id: userid },
        }).then((result) => {
          if (result.role_id == 1) {
            User.update(req.body, {
              where: { user_id: req.body.user_id },
            }).then((response) => {
              res.status(200).json({
                responseCode: 1,
                message: "Updated Successfully",
              });
            });
          } else {
            res.status(200).json({
              responseCode: 0,
              message: "You are not authorized to access these",
            });
          }
        });
      } else {
        res.status(200).json({
          responseCode: 0,
          message: "You are not authorized to access these",
        });
      }
    });
};

exports.updateUser = (req, res) => {
  if (
    req.headers.user_login_token == null ||
    req.headers.user_login_token == undefined
  ) {
    return res.status(400).send({
      responseCode: 0,
      message: "not Authorised",
    });
  }
  let uid = req.params.uid;
  let req_body = req.body;

  userLoginDetails
    .findOne({
      where: { user_login_token: req.headers.user_login_token },
    })
    .then((response) => {
      userid = response.user_id;
      User.findOne({
        where: { user_id: userid },
      })
        .then((result) => {
          if (result.role_id == 2) {
            return res.status(200).json({
              responseCode: 1,
              message: "Updated Successfully",
            });
          } else {
            User.update(req_body, {
              where: { user_id: uid },
            })
              .then((response) => {
                return res.status(200).send({
                  responseCode: 1,
                  message: "Updated Successfully",
                });
              })
              .catch((err) => {
                return res.status(400).send({
                  responseCode: 0,
                  message: "No Record Found",
                  data: null,
                });
              });
          }
        })
        .catch((err) => {
          console.log("thi is error object---->", err.message);
          return res.status(400).json({
            responseCode: 0,
            message: "no Record Found 2",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        responseCode: 0,
        message: "no Record Found 3",
      });
    });
};

exports.adminLogin = async (req, res) => {
  var token = generateUserLoginToken();
  macaddress.one(function (err, mac) {
    unique_id = mac;
  });
  var query = db.sequelize
    .query(
      "SELECT user_id, full_name, email, password, status, role_id from tbl_users WHERE email = (:email)",
      {
        replacements: {
          email: req.body.email,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((resp) => {
      if (resp.length > 0) {
        bcrypt.compare(req.body.password, resp[0].password, function (
          err,
          result
        ) {
          if (result == true) {
            if (resp[0].status == 0) {
              res.status(200).json({
                responseCode: 0,
                message: "Unauthorized",
              });
            } else {
              var query = db.sequelize
                .query(
                  "DELETE from tbl_user_login_details WHERE user_id = (:user_id)",
                  {
                    replacements: {
                      user_id: resp[0].user_id,
                    },
                    type: db.sequelize.QueryTypes.DELETE,
                  }
                )
                .then((userLoginResp) => {
                  userLoginDetails
                    .create({
                      user_id: resp[0].user_id,
                      user_login_token: token.encryptedData,
                      status: 1,
                    })
                    .then((respo) => {
                      resp[0]["token"] = token.encryptedData;
                      resp[0]["updatedAt"] = respo.updatedAt;
                      resp[0]["createdAt"] = respo.createdAt;
                      delete resp[0]["password"];
                      delete resp[0]["phone_number"];
                      delete resp[0]["address"];

                      res.status(200).json({
                        responseCode: 1,
                        message: "Login successfully",
                        user_info: resp[0],
                      });
                    });
                });
            }
          } else {
            res.status(200).json({
              responseCode: 0,
              message: "invalid credential",
            });
          }
        });
      } else {
        res.status(200).json({
          responseCode: 0,
          message: "invalid credential",
        });
      }
    });
};

exports.login = async (req, res) => {
  var token = generateUserLoginToken();
  macaddress.one(function (err, mac) {
    unique_id = mac;
  });
  var query = db.sequelize
    .query(
      "SELECT user_id, full_name, email, password, status, role_id from tbl_users WHERE email = (:email)",
      {
        replacements: {
          email: req.body.email,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((resp) => {
      if (resp.length > 0) {
        bcrypt.compare(req.body.password, resp[0].password, function (
          err,
          result
        ) {
          if (result == true) {
            if (resp[0].status == 0) {
              res.status(200).json({
                responseCode: 0,
                message: "Blocked",
              });
            } else {
              var query = db.sequelize
                .query(
                  "DELETE from tbl_user_login_details WHERE user_id = (:user_id)",
                  {
                    replacements: {
                      user_id: resp[0].user_id,
                    },
                    type: db.sequelize.QueryTypes.DELETE,
                  }
                )
                .then((userLoginResp) => {
                  userLoginDetails
                    .create({
                      user_id: resp[0].user_id,
                      user_login_token: token.encryptedData,
                      status: 1,
                    })
                    .then((respo) => {
                      resp[0]["token"] = token.encryptedData;
                      resp[0]["updatedAt"] = respo.updatedAt;
                      resp[0]["createdAt"] = respo.createdAt;
                      delete resp[0]["password"];
                      delete resp[0]["phone_number"];
                      delete resp[0]["address"];

                      res.status(200).json({
                        responseCode: 1,
                        message: "Login successfully",
                        user_info: resp[0],
                      });
                    });
                });
            }
          } else {
            res.status(200).json({
              responseCode: 0,
              message: "invalid credential",
            });
          }
        });
      } else {
        res.status(200).json({
          responseCode: 0,
          message: "invalid credential",
        });
      }
    });
};

exports.emailVerification = (req, res) => {
  var query = db.sequelize
    .query(
      "SELECT user_id, email, full_name, email_verify_date, email_verification_code, address FROM tbl_users WHERE email = (:email) ",
      {
        replacements: {
          email: req.body.email,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((resp) => {
      if (resp[0].email_verify_date != null) {
        res.status(200).json({
          responseCode: 0,
          message: "Email already verified",
        });
      } else {
        if (
          req.body.email_verification_code != resp[0].email_verification_code
        ) {
          res.status(200).json({
            responseCode: 0,
            message: "Invalid otp",
          });
        } else {
          db.sequelize
            .query(
              "UPDATE tbl_users SET email_verify_date = (:time), email_verification_code = '' WHERE user_id = (:uid)",
              {
                replacements: {
                  time: new Date().getTime(),
                  uid: resp[0].user_id,
                },
                type: db.sequelize.QueryTypes.UPDATE,
              }
            )
            .spread(function (results, metadata) {
              if (metadata > 0) {
                res.status(200).json({
                  responseCode: 1,
                  message: "verified successfully",
                });
              } else {
                res.status(200).json({
                  responseCode: 0,
                  message: "Unable to verify",
                });
              }
            });
        }
      }
    });
};

exports.resendEmailVerificationCode = (req, res) => {
  email = req.body.email;
  otp = randomNumber();
  var query = db.sequelize
    .query("SELECT email_verify_date FROM tbl_users WHERE email = (:email)", {
      replacements: {
        email: req.body.email,
      },
      type: db.sequelize.QueryTypes.SELECT,
    })
    .then((resp) => {
      console.log("this is the date value ", resp[0].email_verify_date);
      if (resp[0].email_verify_date != null) {
        res.status(200).json({
          responseCode: 0,
          message: "User already verified",
          data: "",
        });
      } else {
        var query = db.sequelize
          .query(
            "UPDATE tbl_users SET email_verification_code = (:vefication_code) WHERE email = (:email)",
            {
              replacements: {
                email: req.body.email,
                vefication_code: otp,
              },
              type: db.sequelize.QueryTypes.UPDATE,
            }
          )
          .spread(function (results, metadata) {
            if (metadata == 1) {
              mailSend(email, otp);
              res.status(200).json({
                responseCode: 1,
                message: "Verification code send to your email",
                data: "",
              });
            } else {
              res.status(200).json({
                responseCode: 0,
                message: "user not register",
                data: "",
              });
            }
          });
      }
    });
};

function generateUserLoginToken() {
  let time = new Date().getTime();
  var user_login_token = time / 4;
  if (user_login_token % 7 == 0) {
    user_login_token = "$@" + user_login_token + "@5";
  } else if (user_login_token % 3 == 0) {
    user_login_token = "$" + user_login_token + "$`@";
  } else if (user_login_token % 2 == 0) {
    user_login_token = "^" + user_login_token + "@`$";
  } else if (user_login_token % 2 != 0) {
    user_login_token = "#^" + user_login_token + "@`*4%";
  }
  return encrypt(user_login_token);
}

function encrypt(text) {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

// // to decrypt hash
// //  function decrypt(text) {
// //   let iv = Buffer.from(text.iv, 'hex');
// //   let encryptedText = Buffer.from(text.encryptedData, 'hex');
// //   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
// //   let decrypted = decipher.update(encryptedText);
// //   decrypted = Buffer.concat([decrypted, decipher.final()]);
// //   return decrypted.toString();
// //  }

function mailSend(email, otp) {
  console.log(email);
  console.log(otp);
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "vikasguptabc4@gmail.com",
      pass: "Tester12!@",
    },
  });

  var mailOptions = {
    from: "vikasguptabc4@gmail.com",
    to: email,
    subject: "Jitsi otp ",
    text: "OTP: " + otp,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
    } else {
      emailInfo = info.response;
    }
  });
  return emailInfo;
}

function randomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

exports.forgetPassword = async (req, res) => {
  if (req.body.email == null) {
    return res.status(200).send({
      responseCode: 0,
      message: "please provide email",
    });
  }
  db.sequelize
    .query(
      "SELECT user_id, full_name, email FROM tbl_users WHERE email = (:email)",
      {
        replacements: {
          email: req.body.email,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((resp) => {
      if (resp.length == 0) {
        res.status(200).send({
          responseCode: 0,
          message: "User not found",
        });
      } else {
        otp = randomNumber();
        db.sequelize
          .query(
            "UPDATE tbl_users SET email_verification_code = (:email_verification_code) WHERE email = (:email)",
            {
              replacements: {
                email_verification_code: otp,
                email: req.body.email,
              },
              type: db.sequelize.QueryTypes.UPDATE,
            }
          )
          .spread(function (results, metadata) {
            if (metadata == 1) {
              mailSend(req.body.email, otp);
              res.status(200).json({
                responseCode: 1,
                message: "Otp sent to your email ",
              });
            } else {
              res.status(200).json({
                responseCode: 0,
                message: "Something went wrong",
              });
            }
          });
      }
    });
};

exports.confirmForgetPassword = async (req, res) => {
  console.log(req.body)
  if (
    req.body.email == null ||
    req.body.otp == null ||
    req.body.new_password == null
  ) {
    return res.status(200).send({
      responseCode: 0,
      message: "please provide email,otp and new_password",
    });
  }
  hashed_pass = await bcrypt.hash(req.body.new_password, saltRounds);

  var query = db.sequelize
    .query(
      "SELECT password, email_verification_code, email from tbl_users WHERE email = (:email)",
      {
        replacements: {
          email: req.body.email,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    )
    .then((userInfo) => {
      console.log(userInfo);
      if (userInfo.length == 0) {
        return res.status(200).json({
          responseCode: 0,
          message: "No record Found 1",
        });
      }
      if (userInfo[0].email_verification_code == req.body.otp) {
        db.sequelize
          .query(
            "UPDATE tbl_users SET password = (:password) WHERE email = (:email)",
            {
              replacements: {
                password: hashed_pass,
                email: req.body.email,
              },
              type: db.sequelize.QueryTypes.UPDATE,
            }
          )
          .spread(function (results, metadata) {
            if (metadata == 1) {
              return res.status(200).json({
                responseCode: 1,
                message: "Password Updated successfully",
              });
            } else {
              return res.status(200).json({
                responseCode: 0,
                message: "Something went wrong",
              });
            }
          });
      } else {
        return res.status(200).json({
          responseCode: 0,
          message: "otp is incorrect",
        });
      }
    });
};

exports.logout = (req, res) => {
  var query = db.sequelize
    .query(
      "DELETE from tbl_user_login_details WHERE user_login_token = (:user_login_token)",
      {
        replacements: {
          user_login_token: req.headers.user_login_token,
        },
        type: db.sequelize.QueryTypes.DELETE,
      }
    )
    .then((userLoginResp) => {
      res.status(200).json({
        responseCode: 1,
        message: "Logged out successfully!!",
      });
    });
};

exports.delete = (req, res) => {
  if (
    req.headers.user_login_token == null ||
    req.headers.user_login_token == undefined ||
    req.headers.user_login_token == ""
  ) {
    res.status(200).json({
      responseCode: 0,
      message: "you are not authorized to access these",
    });
  } else {
    var query = db.sequelize
      .query(
        "SELECT * from tbl_user_login_details WHERE user_login_token = (:user_login_token)",
        {
          replacements: {
            user_login_token: req.headers.user_login_token,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      )
      .then((userDetailInfo) => {
        if (userDetailInfo.length > 0) {
          var query = db.sequelize
            .query(
              "SELECT user_id, role_id, full_name from tbl_users WHERE user_id = (:user_id)",
              {
                replacements: {
                  user_id: userDetailInfo[0].user_id,
                },
                type: db.sequelize.QueryTypes.SELECT,
              }
            )
            .then((userInfo) => {
              if (userInfo[0].role_id == 1) {
                if (
                  req.body.user_id == null ||
                  req.body.user_id == undefined ||
                  req.body.user_id == ""
                ) {
                  res.status(200).json({
                    responseCode: 0,
                    message: "You are not authorized to access these",
                  });
                } else {
                  User.update(
                    { status: 0 },
                    {
                      where: { user_id: req.body.user_id },
                    }
                  ).then((response) => {
                    if (response == 1) {
                      res.status(200).json({
                        responseCode: 1,
                        message: "Deleted successfully",
                      });
                    } else {
                      res.status(200).json({
                        responseCode: 0,
                        message: "Something went wrong",
                      });
                    }
                  });
                }
              } else {
                res.status(200).json({
                  responseCode: 0,
                  message: "You are not authorized to access these",
                });
              }
            });
        } else {
          res.status(200).json({
            responseCode: 0,
            message: "You are not authorized to access these",
          });
        }
      });
  }
};
