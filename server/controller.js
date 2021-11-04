const path = require('path');
const model = require('./model');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const now_date = moment().format('YYYY-MM-DD HH:mm:ss');

const AWS = require('aws-sdk');

AWS.config.loadFromPath(
  path.join(__dirname, 'config', 'awsConfig.json')
);

module.exports = {
  needs: () => upload,
  add: {
    board: (req, res) => {
      const body = req.body;

      model.add.board(body, now_date, result => {
        if (result) {
          res.send(true);
        }
      })
    },
    category: (req, res) => {
      const body = req.body;

      model.add.category(body, result => {
        var obj = {};
        if (result) {
          obj['suc'] = true;
          obj['msg'] = '카테고리가 생성되었습니다.';

        } else {
          obj['suc'] = false;
          obj['msg'] = '이미 있는 카테고리 입니다.';
        }
        res.send(obj)
      })
    },
    reply : (req, res) => {
      const body = req.body;

      model.add.reply(body, now_date, result => {
        res.send(result)
      })
    }
  },
  get: {
    board: (req, res) => {
      const body = req.body;

      model.get.board(body, result => {
        if (result) {
          res.send(result);
        }
      })
    },
    board_cnt: (req, res) => {
      const body = req.body;

      model.get.board_cnt(body, cnt => {
        const result = { cnt: cnt }
        res.send(result)
      })
    },
    board_data: (req, res) => {
      const body = req.body;

      model.get.board_data(body, data => {
        const result = { data: data }
        res.send(result)
      })
    },
    category: (req, res) => {

      model.get.category(data => {
        res.send(data)
      })
    },
    pre_and_next: (req, res) => {
      const body = req.body;

        model.get.pre_and_next(body, data => {
          res.send(data)
        })
    },
    reply_data: (req, res) => {
      const body = req.body;

        model.get.reply_data(body, data => {
          res.send(data)
        })
    },
  },
  update: {
    view_cnt: (req, res) => {
      const body = req.body;

      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      const cookie_name = 'board_' + body.id;
      const exist_cookie = req.cookies[cookie_name]

      if (!exist_cookie) {
        res.cookie(cookie_name, true, {
          expires: expires
        });
        model.update.view_cnt(body, result => {
          if (result) {
            res.send(true);
          }
        })
      }
      else{
        res.send(true)
      }
    },
    board: (req, res) => {
      const body = req.body;

      model.update.board(body, data => {
        res.send(true);
      })
    },
  },
  delete: {
    category: (req, res) => {
      const body = req.body;

      model.delete.category(body, result => {
        if (result) {
          res.send(result);
        }
      })
    },
    board: (req, res) => {
      const body = req.body;

      model.delete.board(body, () => {
        res.send(true)
      })
    },
    reply: (req, res) => {
      const body = req.body;

        model.delete.reply(body, () => {
          res.send(true)
        })
    }
  },
  modify: {
    category: (req, res) => {
      const body = req.body;

      model.modify.category(body, result => {
        var obj = {};

        if (result) {
          obj['suc'] = true;
          obj['msg'] = '카테고리가 변경되었습니다.';

        } else {
          obj['suc'] = false;
          obj['msg'] = '이미 있는 카테고리 입니다.';
        }
        res.send(obj);
      })
    }
  },
}