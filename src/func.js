exports.ErrorResult = (err,msg)=>{

    return {
        code : err,
        msg : msg
    }
}


exports.delay=(ms)=>{    
    return new Promise(resolve => setTimeout(resolve, ms));
}
const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('./key');
exports.decodedToken = async (token)=>{
    return new Promise((resolve,reject)=>{
        try{
            console.log('decode >>',token);
            const _secret_key = SECRET_KEY.toString();
            jwt.verify(token,_secret_key,(err,decoded)=>{
                if(err){         
                    console.error('err',err);
                    reject(err)
                }else{
                    
                    resolve(decoded);
                }
            });
        }catch(err){
            console.log('catch err',err);
            reject(err);
        }
    });
}