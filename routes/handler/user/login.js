
module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{
        if(typeof req.body.email === 'undefined' || req.body.email === ''){
            res.status(400).send(ErrorResult(ERROR.ERROR_USER_LOGIN_EMAIL,'email is empty'));
            res.end();
            return;
        }    

        const {email} = req.body;
        const _ret = await db_login(email);
        res.status(200).send(_ret);
        res.end();
    }catch(err){
        let _msg = 'login >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}

const jwt = require('jsonwebtoken');
const db_login = async(email)=>{
    const ERROR = require('@root/src/error');
    const {db} = require('@root/src/db');    
    const config = require('@root/config');    
    const {delay,decodedToken} = require('@root/src/func');
    const {SECRET_KEY} = require('@root/src/key');


    let _ret = await db.query('select idx,uuid from things.users where email=?',[email]);
    console.log('ret >> ',_ret);
    if(_ret.length <= 0){
        return {
            code:ERROR.ERROR_USER_LOGIN_NOT_USER,
            msg:`not user by ${email}`}
    }else{
        const {idx:user_idx,uuid} = _ret[0];
        
        const _payload = {
            uuid
        }

        let _secret_key = SECRET_KEY.toString();

        let _token = jwt.sign(_payload,_secret_key,{algorithm:'HS512',expiresIn:config.JWT_EXPIRE});  

        await delay(1000);
        let _refresh_token   = jwt.sign(_payload,_secret_key,{algorithm:'HS512',expiresIn:config.REFRESH_JWT_EXPIRE}); 
        _ret = await db.query('update things.users set token=?,refresh_token=? where idx=?',[_token,_refresh_token,user_idx]);
        
        if(_ret.affectedRows !== 1){
            return {
                code:ERROR.ERROR_USER_LOGIN_TOKEN,
                msg:`save token error`}
        }else{
            return {
                code : ERROR.SUCCESS,
                msg:`success`,
                data:{
                    token:_token,
                    refresh_token:_refresh_token
                }
            }
        }

    }
    return true;
}

