
module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{       
  
        if(req.uuid === null){
            res.status(400).send(ErrorResult(ERROR.ERROR_GET_HEART_AND_BONUS_HEART_UUID,
                'uuid is error'));
            res.end();
            return;
        }
        const _ret = await db_get_heart_and_bonus_heart(req.uuid);
        res.status(200).send(_ret);
        res.end();
    }catch(err){
        let _msg = 'get_heart_and_bounus_heart >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}

const db_get_heart_and_bonus_heart = async(uuid)=>{

    const {db} = require('@root/src/db'); 
    const ERROR = require('@root/src/error');

    try{
        const _ret = await db.query(`call sp_get_heart_and_bonus_heart(?,
            @o_total_sum_bonus_heart,
           @o_total_sum_heart,
           @o_ret)`,[uuid]);
   
        console.error('_ret ',_ret);
       if(_ret[0][0].o_ret !== 0){
           return {
               code : ERROR.ERROR_GET_HEART_AND_BONUS_HEART_DB,
               msg : `db error`
           };
       }
   
       return {
           code : ERROR.SUCCESS,
           msg : `success`,
           data : {
               total_sum_bonus_heart: _ret[0][0].o_total_sum_bonus_heart === null ? 0 : _ret[0][0].o_total_sum_bonus_heart,
               total_sum_heart:_ret[0][0].o_total_sum_heart === null ? 0 : _ret[0][0].o_total_sum_heart
           }
       }
    }catch(err){
        return {
            code : ERROR.ERROR_GET_HEART_AND_BONUS_HEART_SYSTEM,
            msg : `get_heart_and_bonus_heart system error ${err}`
        }
    }

}
