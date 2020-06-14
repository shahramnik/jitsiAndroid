module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("tbl_users", {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    full_name: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
      required: false,
    },
    role_id: {
      type: Sequelize.INTEGER,
    },
    date_of_birth: {
      type: Sequelize.DATE,
      required: false,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    email_verification_code: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "create_at",
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "update_at",
    },
  });

  return User;
};
