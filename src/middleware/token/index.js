//const debug = require('debug')('parob:middleware');
//const jwt = require('jsonwebtoken');
const path = require('path');

const isExpireToken = async (req,res,next) =>{    
    const config = require('@root/config');
    const {decodedToken,ErrorResult} = require('@root/src/func');
    const ERROR = require('@root/src/error');

    if( req.url === '/api/v1/user/signup' ||
        req.url === '/api/v1/user/login' 
        ){
            
        next();
    }else{
        console.log('headers >> ',req.headers.authorization);
        let token  = req.headers.authorization || '';
        
        if(token !==''){            
            console.log('1111');
            if(token.startsWith('Bearer ')){             
                let _t = token.split(' ')[1];     
                decodedToken(_t).then(ret=>{                    
                    req.uuid = ret.uuid;                    
                    next();
                }).catch(err=>{      
                    console.log('22222 >> ',err);                                 
                    if(err){                    
                        if(err.name === 'JsonWebTokenError'){                            
                            res.status(403).send(ErrorResult(ERROR.ERROR_TOKEN_POLLUTION,"token is plluted"));
                            res.end();
                            return;
                        }else if(err.name === 'TokenExpiredError'){                               
                            res.status(403).send(ErrorResult(ERROR.ERROR_TOKEN_EXPIRE,"token is expired"));
                            res.end();
                            return;
                        }
                    }
                })              
            }else{           
                console.log('3333');     
                res.status(403).send(ErrorResult(ERROR.ERROR_TOKEN_EMPTY,"token is required"));
                res.end();
                return;
            }
            
        }else{
            console.log('444');
            res.status(401).send(ErrorResult(ERROR.ERROR_TOKEN_EMPTY,"token is required"));
            res.end();
            return;
        }

    }   
    
    
}



module.exports = isExpireToken;
