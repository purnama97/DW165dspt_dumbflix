'use strict';
module.exports = (sequelize, DataTypes) => {
  const episode = sequelize.define('episode', {
    titleEpi: DataTypes.STRING,
    thumbnailEpi: DataTypes.STRING,
    linkFilm: DataTypes.STRING,
    filmId: DataTypes.STRING
  }, {});
  episode.associate = function(models) {
    episode.belongsTo(models.film, {
      foreignKey: {
        name: "filmId",
      },
    });
  };
  return episode;
};
