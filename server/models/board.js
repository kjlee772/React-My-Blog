module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'board',
    {
      board_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING(50),
        allowNull: false
      },

      contents: {
        type: DataTypes.TEXT,
        allowNull: false
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false
      },

      cat_id: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    }
  )
};