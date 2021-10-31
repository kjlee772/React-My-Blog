const sequelize = require('./models').sequelize;

const {
  Admin,
  Board,
  Sequelize: { Op }
} = require('./models');
sequelize.query('SET NAMES utf8;');

module.exports = {
  api: {
    searchInfo: (body, hash, callback) => {
      Admin.findAll({
        where: { [Op.and]: [{ user_id: body.id, password: hash }] }
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        })
    },
    // getData: callback => {
    //   Teacher.findAll()
    //     .then(result => { callback(result) })
    //     .catch(err => { throw err })
    // },
    // addData: (body, callback) => {
    //   Teacher.create({
    //     name: body.data
    //   })
    //   .then(result => {
    //     callback(result);
    //   })
    //   .catch(err => {
    //     console.log('addData 에러!!!');
    //     throw err;
    //   })
    // },
    // modifyData: (body, callback) => {
    //   Teacher.update({name: body.modify.name}, {
    //     where: {id: body.modify.id}
    //   })
    //   .then(result => callback(result))
    //   .catch(err =>{
    //     console.log('modifyData 에러!!!');
    //     throw err;
    //   })
    // },
    // deleteData: (body, callback) => {
    //   Teacher.destroy({
    //     where: {id: body.delete.id}
    //   })
    //   .then(callback(true))
    //   .catch(err => {
    //     console.log('deleteData 에러!!!');
    //     throw err;
    //   })
    // }
  },
  add: {
    board: (body, callback) => {

      Board.create({
        title: body.title,
        contents: body.contents,
        date: new Date()
      })
        .then(data => {
          callback(true)
        })
        .catch(err => {
          throw err;
        })
    }
  },
  get: {
    board: (callback) => {
      Board.findAll()
        .then(data => {
          callback(data)
        })
        .catch(err => {
          throw err;
        })
    },
    board_cnt: (callback) => {
      Board.count()
        .then(result => {
          callback(result);
        })
    }
  },
}