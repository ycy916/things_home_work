
module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{
       
        if(typeof req.body.payment_heart_count === 'undefined' || 
            req.body.payment_heart_count <= 0){
            res.status(400).send(ErrorResult(ERROR.ERROR_PAYMENT_HEART_COUNT,
                'payment_heart_count is error'));
            res.end();
            return;
        }
        if(req.uuid === null){
            res.status(400).send(ErrorResult(ERROR.ERROR_PAYMENT_HEART_UUID,
                'uuid is error'));
            res.end();
            return;
        }
        const _ret = await db_payment_heart(req.uuid,req.body.payment_heart_count);
        res.status(200).send(_ret);
        res.end();
    }catch(err){
        let _msg = 'payment_heart >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}

const db_payment_heart = async(uuid,payment_heart_count)=>{

    const {db} = require('@root/src/db');    
    const ERROR = require('@root/src/error');

    const _ret = await db.query(`call sp_payment_heart(?,?,@o_sum_heart,
                                @o_total_sum_bonus_heart,
                                @o_total_sum_heart,
                                @o_bonus_heart_info,
                                @o_heart_info,
                                @o_ret)`,[uuid,payment_heart_count]);

   console.log('_ret ',_ret);
    let _data =[]
    if(_ret[0][0].o_ret !== 0 ){
        const _o_ret = _ret[0][0].o_ret;
        switch(_o_ret){
            case -1:
                return{
                    code : ERROR.ERROR_PAYMENT_HEART_UUID,
                    msg : `not exist uuid of user`,
                }
            case -2:
                return{
                    code : ERROR.ERROR_PAYMENT_HEART_HEART_LOW,
                    msg : `heart low ${payment_heart_count}/${_ret[0][0].o_sum_heart}`,
                }
        }
    
    }else{
        //보너스 하트 유효기간 임박한 것 부터 정렬
        //유효기간이 지난건 존재 하지 않는다는 조건 안에서 코드를 작성했습니다.       
    
       
        const _bonus_heart = [];
  
        console.info(`o_bonus_heart_info`,_ret[0][0].o_bonus_heart_info);
        if( _ret[0][0].o_bonus_heart_info?.length > 0){
            const _now = new Date();
            const _nt = _now.getTime();           
            _ret[0][0].o_bonus_heart_info.forEach(async element => {
                let _item = {...element};
                const _d = new Date(`${_item.validate_datetime}`);
                _item.d_day = _d.getTime() - _nt;
                _bonus_heart.push(_item);
            })

            //d_day 값이 적을 수록 임박한 보너스 하트 임
            _bonus_heart.sort((a,b)=>{
                if(a.d_day > b.d_day) return 1;
                if(a.d_day < b.d_day) return -1;
                return 0;

            });              
            
            //처리 방법
            //1. 보너스 하트만으로 결제 가능 할 경우
            //2. 보너스 하트는 없고 일반 하트로만 결제 할 경우
            //3. 보너스 하트로 결제하고 일반 하트로 결제 할 경우

        
            if( payment_heart_count <= _ret[0][0].o_total_sum_bonus_heart){
                //보너스 하트만으로 결제 가능 할 경우
                await _calculate_bonus_heart(_bonus_heart,payment_heart_count);
                
            }else{
                //보너스 하트도 결제하고 일반하트도 결제 해야 할 경우
                const _rest_payment_count = await _calculate_bonus_heart(_bonus_heart,payment_heart_count);
               await _calculate_heart(_ret[0][0].o_heart_info,_rest_payment_count);
            }
        }else{
            //일반 하트로만 결제 가능 할 경우
            await _calculate_heart(_ret[0][0].o_heart_info,payment_heart_count);
        }
      
      
    }
    return {
        code : ERROR.SUCCESS,
        msg : `success`
       
    }
}

const _calculate_bonus_heart = async (bonus_heart,payment_heart_count)=>{
    const {db} = require('@root/src/db');    
    const _used_bonus_heart =[];
    const _rest_bonus_heart=[];
    const _used_bonus_heart_idx = [];
    let _phc = payment_heart_count;
    for( let i = 0; i < bonus_heart.length; i++){
        if(_phc > bonus_heart[i].count){
            _used_bonus_heart.push({
                idx:bonus_heart[i].idx,
                count : bonus_heart[i].count,
                used_count : bonus_heart[i].count

            });
            _used_bonus_heart_idx.push(bonus_heart[i].idx);
            _phc -= bonus_heart[i].count;
        }else{
            _rest_bonus_heart.push({
                idx:bonus_heart[i].idx,
                count : bonus_heart[i].count,
                used_count : _phc

            });
            _phc -= bonus_heart[i].count;
            break;
        }

    }

    // console.info('_used_bonus_heart',_used_bonus_heart);
    // console.info('_rest_bonus_heart',_rest_bonus_heart);
    // console.info('_used_bonus_heart_idx',_used_bonus_heart_idx);

    //쿼리 처리

    if(_used_bonus_heart.length > 0){
        await db.query('update things.hearts set deletedAt = now() where idx in (?)',[_used_bonus_heart_idx]);
    }

    if(_rest_bonus_heart.length > 0){
        await db.query('update things.hearts set count = count-? where idx = ?',[_rest_bonus_heart[0].used_count,_rest_bonus_heart[0].idx]);
    }
       
    return _phc;

}

const _calculate_heart = async (heart,payment_heart_count) =>{
    const {db} = require('@root/src/db');  
    const _used_heart=[];
    const _rest_heart=[];
    const _used_heart_idx = [];
    let _phc = payment_heart_count;
    for( let i = 0; i < heart.length; i++){
        if(_phc > heart[i].count){
            _used_heart.push({
                idx:heart[i].idx,
                count : heart[i].count,
                used_count : heart[i].count

            });
            _used_heart_idx.push(heart[i].idx);
            _phc -= heart[i].count;
        }else{
            _rest_heart.push({
                idx:heart[i].idx,
                count : heart[i].count,
                used_count : _phc

            });
            _phc -= heart[i].count;
            break;
        }
    }

    //쿼리처리
    console.info('_used_heart',_used_heart);
    if(_used_heart.length > 0){
        await db.query('update things.hearts set deletedAt = now() where idx in (?)',[_used_heart_idx]);
    }

    if(_rest_heart.length > 0){
        await db.query('update things.hearts set count = count - ? where idx = ?',[_rest_heart[0].used_count,_rest_heart[0].idx]);
    }

    return _phc;
}