module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'teacher',    // 테이블의 이름
    {
      name: {
        type: DataTypes.STRING(50),
        allowNull : true
      },
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false,
    }
  )
};