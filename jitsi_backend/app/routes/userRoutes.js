// const upload = require("../config/aws-multer.js");

module.exports = (app) => {
  const user = require("../controllers/userController.js");

  var router = require("express").Router();

  // router.get("/getUserProfile", user.getUserProfile);

  router.post("/userSignup", user.create);

  router.post("/emailVerification", user.emailVerification);

  router.post("/resendEmailVerificationCode", user.resendEmailVerificationCode);

  router.post("/login", user.login);

  router.post("/adminLogin", user.adminLogin);

  router.post("/delete", user.delete);

  router.post("/forgetPassword", user.forgetPassword);

  router.post("/confirmForgetPassword", user.confirmForgetPassword);

  router.get("/getUserListing/:status", user.getUserListing);

  router.get("/getUserList/:status", user.getUserList);

  router.put("/updateUser/:uid", user.updateUser);

  router.post("/updateUser", user.updateUserInfo);

  router.get("/logout", user.logout);

  app.use("/api/user", router);
};
