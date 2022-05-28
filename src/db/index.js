const DB = require('./db');
const config = require('@root/config');
let db = null;

if(db === null){
    db = new DB({
        host :config.DB.HOST,
        username : config.DB.USERNAME,
        password: config.DB.PASSWORD,
        database:  config.DB.DATABASE,
        waitForConnections: true,
        connection_limit: config.DB.CONNECTION_LIMIT,
        queueLimit: 0,
        time_zone: config.DB.TIME_ZONE,
    });
}

module.exports = {
    db,
}