const sequelize = require('./models').sequelize;

const {
  Board,
  Category,
  User,
  // Like,
  Reply,
  Sequelize: { Op }
} = require('./models');
sequelize.query('SET NAMES utf8;');

module.exports = {
  api: {
    searchInfo: (body, hash, callback) => {
      User.findAll({
        where: { [Op.and]: [{ id: body.id, password: hash }] }
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        })
    },
  },
  add: {
    board: (body, now_date, callback) => {
      Board.create({
        title: body.title,
        contents: body.contents,
        date: now_date,
        view_cnt: 0,
        cat_id: body.category,
        likes: 0,
      })
        .then(() => {
          callback(true)
        })
        .catch(err => {
          throw err;
        })
    },
    category: (body, callback) => {
      Category.count({
        where: { name: body.name }
      })
        .then(cnt => {
          if (cnt > 0) {
            callback(false);
          }
          else {
            Category.create({
              name: body.name
            })
              .then(() => { callback(true) })
              .catch(err => { throw err; })
          }
        })
    },
    user: (body, hash_pw, now_date, callback) => {
      User.count({
        where: { id: body.id }
      })
        .then(cnt => {
          if (cnt > 0) {
            callback(false);
          }
          else {
            User.create({
              admin: 'N',
              id: body.id,
              password: hash_pw,
              name: body.name,
              birthday: body.birthday,
              sex: body.sex,
              email: body.email,
              signup_date: now_date
            })
              .then(() => callback(true));
          }
        })
    },
    reply: (body, now_date, callback) => {
      Reply.create({
        board_id: body.board_id,
        user_id: body.user_id,
        contents: body.contents,
        date: now_date,
      })
        .then(() => callback(true))
        .catch(() => callback(false))
    }
  },
  get: {
    board: (body, callback) => {
      let search = '%%';

      if (body.search) {
        search = '%' + body.search + '%';
      }

      let where_1 = body.category;
      let where_2 = '';

      if (!body.category) {
        where_2 = 0;
      }
      else {
        where_2 = null;
      }

      Board.findAll({
        where: {
          title: { [Op.like]: search },
          contents: { [Op.like]: search },
          cat_id: { [Op.or]: { [Op.eq]: where_1, [Op.gt]: where_2 } }
        },
        limit: body.limit,
        offset: (body.page - 1) * body.limit,

        order: sequelize.literal('board_id DESC')
      })
        .then(data => {
          callback(data)
        })
        .catch(err => {
          throw err;
        })
    },
    board_cnt: (body, callback) => {
      let search = '%%';

      if (body.search) {
        search = '%' + body.search + '%';
      }

      let where_1 = body.category;
      let where_2 = '';

      if (!body.category) {
        where_2 = 0;
      }
      else {
        where_2 = null;
      }

      Board.count({
        where: {
          title: { [Op.like]: search },
          contents: { [Op.like]: search },
          cat_id: { [Op.or]: { [Op.eq]: where_1, [Op.gt]: where_2 } }
        }
      })
        .then(result => {
          callback(result)
        })
        .catch(err => {
          throw err;
        })
    },
    board_data: (body, callback) => {
      Board.findAll({
        where: { board_id: body.id }
      })
        .then(result => {
          callback(result);
        })
        .catch(err => {
          throw err;
        })
    },
    category: (callback) => {
      Category.findAll()
        .then(result => { callback(result); })
        .catch(err => { throw err; })
    },
    pre_and_next: (body, callback) => {
      let result = {};

      let where_1 = body.category;
      let where_2 = '';

      if (!body.category) {
        // 전체보기를 클릭했을 경우
        where_2 = 0;

      } else if (body.category) {
        // 카테고리를 클릭했을 경우
        where_2 = null;
      }

      Board.findAll({
        // 다음글 구하기
        where: {
          board_id: {
            [Op.gt]: body.board_id
          },
          cat_id: {
            [Op.or]: {
              [Op.eq]: where_1,
              [Op.gt]: where_2
            }
          }
        },
        limit: 1

      }).then(
        next => {
          result['next'] = next;

          // 이전글 구하기
          Board.findAll({
            where: {
              board_id: {
                [Op.lt]: body.board_id
              },
              cat_id: {
                [Op.or]: {
                  [Op.eq]: where_1,
                  [Op.gt]: where_2
                }
              }
            },
            limit: 1,
            order: sequelize.literal('board_id DESC')
          })
            .then(
              pre => {
                result['pre'] = pre;
                callback(result);
              }
            )
        }
      )
    },
    reply_data: (body, callback) => {
      let result = {};

      // 전체 데이터 수 구하기
      Reply.count({
        where: {
          board_id: body.board_id
        }
      })
        .then((cnt_result) => {
          result['count'] = cnt_result
        })
        .catch(err => { throw err; })

      //
      Reply.findAll({
        include: [
          {
            model: User,
            //attributes : ['id']
          }
        ],
      })
        .then((data_result) => {
          result['rows'] = data_result

          callback(result)
        })
        .catch(err => { throw err; })
    },
  },
  update: {
    view_cnt: (body, callback) => {
      Board.update({ view_cnt: sequelize.literal('view_cnt + 1') }, {
        where: { board_id: body.id }
      })
        .then(data => {
          callback(true)
        })
        .catch(err => {
          throw err;
        })
    },
    board: (body, callback) => {
      Board.update({
        title: body.title,
        contents: body.contents,
        cat_id: body.category
      },
        { where: { board_id: body.board_id } })
        .then(() => callback(true))
        .catch(err => { throw err; })
    }
  },
  delete: {
    category: (body, callback) => {
      Category.destroy({
        where: { id: body.id }
      })
        .then(() => {
          Board.update({ cat_id: 0 }, {
            where: { cat_id: body.id }
          })
            .then(() => { callback(true) })
            .catch(err => { throw err; })
        })
    },
    board: (body, callback) => {
      Board.destroy({
        where: { board_id: body.board_id }
      })
        .then(() => { callback(true) })
        .catch(err => { throw err; })
    },
    reply : (body, callback) => {
      Reply.destroy({
          where : { reply_id : body.reply_id }
      })
      .then( () => { callback(true) })
      .catch(err => { throw err; })
  }
  },
  modify: {
    category: (body, callback) => {
      Category.count({
        where: { name: body.name }
      })
        .then(cnt => {
          console.log(cnt);
          if (cnt > 0) {
            callback(false);
          } else {
            Category.update({ name: body.name }, {
              where: { id: body.id }
            })
              .then(() => { callback(true) })
              .catch(err => { throw err; })
          }
        })
    }
  },
}