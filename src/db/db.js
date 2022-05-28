const mysql             = require('mysql2');

class DB{
    constructor(params={}){
        this.pool = mysql.createPool({
            host : params.host,
            user: params.username,
            password: params.password,
            database: params.database,
            waitForConnections: true,
            connectionLimit: params.connection_limit,
            queueLimit: 0,
            timezone: params.time_zone,
        });
    }
    query(q,params){
        return new Promise((resolve,reject)=>{
            try{
                this.pool.getConnection((err,conn)=>{
                    if(err){
                        console.error('getConnection error : ',err);
                        reject(err);
                    }else{
                        let query = conn.query(q,params,(err,rows)=>{
                            conn.release();
                            if(err){
                                console.error(`query >> ${query.sql} err >> ${err}`);                                
                                reject(err)
                            }else{
                                console.log(`query >> ${query.sql}`);
                                resolve(rows);
                            }
                        });
                    }
                });
            }catch(err){
                reject(err);
            }
        });
    }

}

module.exports = DB;