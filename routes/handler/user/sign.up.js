module.exports = async(req,res)=>{
    const ERROR = require('@root/src/error');
    const {ErrorResult} = require('@root/src/func');
    try{
        if(typeof req.body.email === 'undefined' || req.body.email === ''){
            res.status(400).send(ErrorResult(ERROR.ERROR_USER_SIGN_UP_EMAIL,`email is empty`));                
            res.end();
            return;
        }    

        if(validateEmail(req.body.email) === false){
            res.status(400).send(ErrorResult(ERROR.ERROR_USER_SIGN_UP_EMAIL_PATTERN,`email pattern error (${req.body.email})`));                
            res.end();
            return;
        }

        const {email} = req.body;

        const _ret = await db_sign_up(email);
        if(_ret !== true){
            res.status(400).send(ErrorResult(ERROR.ERROR_USER_SIGN_UP_DB,`db error`));                
            res.end();
            return
        }

        res.status(200).send(ErrorResult(
            ERROR.SUCCESS,`success`
        ));
        res.end();
    }catch(err){
        let _msg = 'signup >> server system error ' + err;
        res.status(500).send(_msg);
        res.end();        
      }
    
}

const {replace}  = require('lodash');
const {v1} = require('uuid');

const db_sign_up = async(email)=>{
    const {db} = require('@root/src/db');
    const _uuid = replace(v1(),/-/g,'');

    const _ret = await db.query('insert into things.users(uuid,email) values(?,?)',[_uuid,email]);
    if(_ret.affectedRows !== 1){
        return false
    }
    return true;
}

const validateEmail = (email) => {

    const _reg1 = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return _reg1.test(email);
 
  };