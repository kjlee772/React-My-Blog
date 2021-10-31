const path = require('path');
const model = require('./model');

const salt = require(path.join(__dirname, 'config', 'db.json'))
  .salt

const hashing = require(path.join(__dirname, 'config', 'hashing.js'))

const AWS = require('aws-sdk');
AWS.config.loadFromPath(
  path.join(__dirname, 'config', 'awsConfig.json')
);

module.exports = {
  needs: () => upload,
  api: {
    // getData: (req, res) => {
    //   model.api.getData(data => {
    //     return res.send(data)
    //   })
    // },
    // addData: (req, res) => {
    //   const body = req.body;
    //   model.api.addData(body, result => {
    //     if(result){
    //       res.send(true);
    //     }
    //   })
    // },
    // modifyData: (req, res) => {
    //   const body = req.body;
    //   model.api.modifyData(body, result => {
    //     if(result){
    //       res.send(true);
    //     }
    //   })
    // },
    // deleteData: (req, res) => {
    //   const body = req.body;
    //   model.api.deleteData(body, result => {
    //     if(result){
    //       res.send(true);
    //     }
    //   })
    // },
    sendPw: (req, res) => {
      const body = req.body;
      const hash = hashing.enc(body.id, body.password, salt)

      model.api.searchInfo(body, hash, result => {
        var obj = {};
        if (result[0]) {
          obj['suc'] = true;
          obj['msg'] = '로그인 성공';

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

      model.add.board(body, result => {
        if (result) {
          res.send(true);
        }
      })
    }
  },
  get: {
    board: (req, res) => {

      model.get.board(result => {
        if (result) {
          res.send(result);
        }
      })
    },
    board_cnt: (req, res) => {

      model.get.board_cnt(cnt => {
        const result = { cnt: cnt }
        res.send(result)
      })
    }
  },
}