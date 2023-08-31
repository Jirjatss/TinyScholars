"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Instructor.belongsTo(models.Course);
    }
  }
  Instructor.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      gender: DataTypes.STRING,
      email: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      schedule: DataTypes.STRING,
      CourseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Instructor",
    }
  );
  return Instructor;
};
