"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserProfile.belongsTo(models.User);
    }

    getGreeting() {
      let salutation = "";
      if (this.gender === "Male") {
        salutation = "Mr.";
      } else if (this.gender === "Female") {
        salutation = "Ms.";
      }
      return `${salutation} ${this.fullName}`;
    }
  }
  UserProfile.init(
    {
      fullName: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
