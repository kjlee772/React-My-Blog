module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 0
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    }
  )
};