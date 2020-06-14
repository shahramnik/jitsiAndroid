module.exports = (sequelize, Sequelize) => {
  const UserLoginDetail = sequelize.define("tbl_user_login_details", {
    user_login_details_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
    device_type: {
      type: Sequelize.INTEGER,
    },
    device_os_detail: {
      type: Sequelize.STRING,
    },
    device_unique_id: {
      type: Sequelize.STRING,
    },
    device_push_token: {
      type: Sequelize.STRING,
      required: false,
    },
    user_login_token: {
      type: Sequelize.INTEGER,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: "create_at",
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: "update_at",
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: "delete_at",
    },
    remark: {
      type: Sequelize.STRING,
    },
  });

  return UserLoginDetail;
};
