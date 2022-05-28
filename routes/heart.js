const express = require('express');
const router = express.Router();
const ChargingHeart = require('./handler/heart/charging.heart');
const ChargingBonusHeart = require('./handler/heart/charging.bonus.heart');
const GetHeartList = require('./handler/heart/heart.list');
const PaymentHeart = require('./handler/heart/payment.heart');
const GetHeartAndBonusHeart = require('./handler/heart/get.heart.and.bonus.heart');
router.post('/charging/heart', ChargingHeart);
router.post('/charging/bonus_heart', ChargingBonusHeart);
router.post('/payment',PaymentHeart);

router.get('/list/:page',GetHeartList);
router.get('/get_heart_and_bonus_heart',GetHeartAndBonusHeart);


module.exports = router;