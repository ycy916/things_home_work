const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require("@root/config");
const cors = require('cors');
class App {
    constructor(){
        this.app = app;
        this.port = config.PORT;
        this.server = null;
    }

    /**
     * 
     */
    init(){
        this.app.use(cors());
        this.app.use(bodyParser.json());
        this.app.use(express.urlencoded({extended:false}));  
    }
    /**
     * 
     * @param {function} middleware 
     */
    setMiddleware(middleware){
        this.app.use(middleware);
    }
    /**
     * 라우터 세팅 함수
     * @param  {string} url 경로
     * @param  {router} route 라우터
     * @return void
     */
    setRouter(url,route){
        this.app.use(url,route);
    }
    /**
     * 
     * @param {*} url 
     * @param {*} serve 
     * @param {*} option 
     */
    setSwagger(url,serve,spec){
        this.app.use(url,serve,spec);
    }
    /**
     * 서버 시작 함수
     * @return void
     */
    start() {
        const config = require('@root/config');        
        this.server = this.app.listen(this.port,()=>{
            console.log(`server start port(${this.port})`);
        })
    }

    stop() {
        const config = require('@root/config');        
        this.server?.close(()=>{
            console.log(`server stop`);
        });
    }

}

module.exports = App;
