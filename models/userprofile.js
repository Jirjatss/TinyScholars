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
        if (this.gender === 'Male') {
          return `Siswa ${this.fullName}`
        } else if (this.gender === 'Female') {
          return `Siswi ${this.fullName}`
        } else {
          return ''
        }
    }

  }
  UserProfile.init(
    {
      fullName: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserProfile",
    }
  );
  return UserProfile;
};
