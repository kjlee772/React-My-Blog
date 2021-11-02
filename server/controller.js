const path = require('path');
const model = require('./model');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const now_date = moment().format('YYYY-MM-DD HH:mm:ss');

const salt = require(path.join(__dirname, 'config', 'db.json'))
  .salt

const hashing = require(path.join(__dirname, 'config', 'hashing.js'))

const user_ip = require('ip');

const AWS = require('aws-sdk');

AWS.config.loadFromPath(
  path.join(__dirname, 'config', 'awsConfig.json')
);

module.exports = {
  needs: () => upload,
  api: {
    sendPw: (req, res) => {
      const body = req.body;
      const hash = hashing.enc(body.id, body.password, salt)

      model.api.searchInfo(body, hash, result => {
        var obj = {};
        if (result[0]) {
          obj['suc'] = result[0].dataValues;
          obj['msg'] = '로그인 성공';
          obj['ip'] = user_ip.address();

        } else {
          obj['suc'] = false;
          obj['msg'] = '로그인 실패';
        }

        res.send(obj);
      })
      console.log('1. salt 값 : ', salt)
      console.log('3. hash 결과 : ', hash)
    },
  },
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
    user: (req, res) => {
      const body = req.body;

      const hash_pw = hashing.enc(body.id, body.password, salt);

      model.add.user(body, hash_pw, now_date, result => {
        res.send(result);
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
    user_info: (req, res) => {
      const body = req.body;

        model.get.user_info(body, data => {
          res.send(data)
        })
    }
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
    password: (req, res) => {
      const body = req.body;
      const hash_pw = hashing.enc(body.user_id, body.change_password, salt);

      model.update.password(body, hash_pw, result => {
        res.send(true)
      })
    },
    // like: (req, res) => {
    //   const body = req.body;

    //   model.check.like(body, data => {
    //     // 중복이 아닌 경우
    //     if(data.length === 0) {
    //       model.update.like(body, result => {
    //         res.send(result)
    //       })

    //     } else {
    //       // 이미 좋아요를 눌렀을 경우
    //       if(body.type === 'remove') {
    //         model.update.like(body, result => {
    //           res.send(result)
    //         })

    //       } else {
    //         res.send(false)
    //       }
    //     }
    //   }) 
    // },
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
  // check : {
  //   like : (req, res) => {
  //     const body = req.body;

  //     model.check.like(body, result => {
  //       res.send(result);
  //     })
  //   }
  // }
}