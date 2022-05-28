
module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{
       
        if(typeof req.params.page === 'undefined' ||
        parseInt(req.params.page,10) <=0){
            res.status(400).send(ErrorResult(ERROR.ERROR_HEART_LIST_PAGE,
                `page is error (${req.params.page})`));
            res.end();
            return
        }
        if(req.uuid === null){
            res.status(400).send(ErrorResult(ERROR.ERROR_HEART_LIST_UUID,
                'uuid is error'));
            res.end();
            return;
        }
        const _ret = await db_heart_list(req.uuid,req.params.page);
        res.status(200).send(_ret);
        res.end();
    }catch(err){
        let _msg = 'heart.list >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}

const db_heart_list = async(uuid,page)=>{

    const {db} = require('@root/src/db');    
    const ERROR = require('@root/src/error');

    try{
        const _ret = await db.query('call sp_heart_list(?,?,@heart_info,@total_count,@o_ret)',[uuid,page]);
        console.info('_ret ',_ret);
        //const _data = _ret.length <= 0 ? null : [...ret];
        let _data =[]
        if(_ret[0][0].o_heart_info.length > 0 ){
            _ret[0][0].o_heart_info.forEach(async element => {
                let _item ={
                    ...element,
                    type : element.type === 0 ? `일반하트` : `보너스하트`
    
                }
                if(_item.type === 1){
                    //보너스 하트 유효기간 표시
                    _item.validate_datetime = element.validate_datetime;
                }
    
                _data.push(_item);
                
            });
        }
        return {
            code : ERROR.SUCCESS,
            msg : `success`,
            data :{
                total_count : _ret[0][0].o_total_count,
                heart_info : _data
            }
        }
    }catch(err){
        return {
            code : ERROR.ERROR_HEART_LIST_SYSTEM,
            msg : `heart list system error ${err}`
        }
    }
    //const _ret = await db.query(`select a.idx,a.type,a.count,date_format(a.createdAt,'%Y-%m-%d %T') as createdAt from things.hearts as a inner join things.users as b on b.idx = a.user_idx where b.uuid=? and b.deletedAt is null`,[uuid]);
  
}