"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User);
      Transaction.belongsTo(models.Course);
    }
  }
  Transaction.init(
    {
      UserId: DataTypes.INTEGER,
      CourseId: DataTypes.INTEGER,
      transactionCourse: DataTypes.STRING,
      transactionCourseDate: DataTypes.DATE,
      transactionStatus: DataTypes.STRING,
      transactionCost: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  Transaction.beforeCreate((transactions) => {
    transactions.transactionStatus = "Pending";
  });
  return Transaction;
};
