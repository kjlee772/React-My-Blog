const express = require('express');
const router = express.Router();
const controller = require('./controller');

// router.get('/get/data', controller.api.getData);

// router.post('/add/data', controller.api.addData);
// router.post('/modify/data', controller.api.modifyData);
// router.post('/delete/data', controller.api.deleteData);

router.post('/send/pw', controller.api.sendPw);
router.post('/add/board', controller.add.board);
router.get('/get/board', controller.get.board);

router.get('/get/board_cnt', controller.get.board_cnt);


module.exports = router;