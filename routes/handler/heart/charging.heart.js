
module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{

        console.log(`start`,req.body);
        console.log('req.body.heart_count',req.body.heart_count);

        if(typeof req.body.heart_count === 'undefined' || req.body.heart_count <= 0){
                console.log('11111');
            res.status(400).send(ErrorResult(ERROR.ERROR_CHARGING_HEART_COUNT,
                'heart_count is error'));
            res.end();
            return;
        }
        console.log('2222');
        
        const {heart_count} = req.body;       

        const _ret = await db_charging_heart(req.uuid,heart_count);

        res.status(200).send(_ret);
        res.end();
    }catch(err){
        let _msg = 'charging_heart >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}


const db_charging_heart = async(uuid,count)=>{
    const {db} = require('@root/src/db');    
    const ERROR = require('@root/src/error');

    const _ret = await db.query('call sp_charging_heart(?,?,@o_ret)',[uuid,count]);

    console.error('_ret',_ret);
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
