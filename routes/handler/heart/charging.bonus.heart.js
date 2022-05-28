
module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{
        console.log(`start `,req.body);
        if(req.body.bonus_heart_count === 'undefined' || 
            req.body.bonus_heart_count <=0){
            res.status(400).send(ErrorResult(ERROR.ERROR_CHARGING_BONUS_HEART_COUNT,
                'bonus_heart_count is error'));
            res.end();
            return;
        }  

        if(req.body.validate_datetime === 'undefined' || 
            req.body.validate_datetime === ''){
                res.status(400).send(ErrorResult(ERROR.ERROR_CHARGING_BONUS_HEART_VALIDATE_DATETIME,
                    `validate_datetime is error (${req.body.validate_datetime})`));
                res.end();
            return;
        }

        const {bonus_heart_count,validate_datetime} = req.body;       
        const _ret = await db_charging_bonus_heart(req.uuid,bonus_heart_count,validate_datetime);
        res.status(200).send(_ret);
        res.end();
    }catch(err){
        let _msg = 'charging_bonus_heart >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const db_charging_bonus_heart = async(uuid,count,datetime)=>{
    const {db} = require('@root/src/db');    
    const ERROR = require('@root/src/error');

    //원하는 날짜 기간까지 보너스 하트 사용 가능
    const _t = convertTimeToDB(datetime);
    console.log('t',_t);
    const _ret = await db.query('call sp_charging_bonus_heart(?,?,?,@o_ret)',[uuid,count,_t]);


    if(_ret[0][0].o_ret !==0){
        return {
            code : ERROR.ERROR_CHARGING_HEART_DB,
            msg : `db error (${_ret[0][0].o_ret})`
        }
    }

    return {
        code : ERROR.SUCCESS,
        msg : `success`
    }
}

function convertTimeToDB(t){
    //GMT +9hours
    const _d = `${t}T14:59:59.000Z`;      
    return moment(new Date(_d)).format('yyyy-MM-DD HH:mm:ss');

}