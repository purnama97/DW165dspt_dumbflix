'use strict';
module.exports = (sequelize, DataTypes) => {
  const transaction = sequelize.define('transaction', {
    startDate: DataTypes.STRING,
    dueDate: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    attache: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  transaction.associate = function(models) {
    transaction.belongsTo(models.user, {
      foreignKey: {
        name: "userId",
      },
    });
  };
  return transaction;
};