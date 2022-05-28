require('module-alias/register');
const YAML = require('yamljs');
const path = require('path');
const App = require('@root/src/app');
const user = require('@root/routes/user');
const heart = require('@root/routes/heart');
const swaggerUI = require('swagger-ui-express');
const isExpireToken = require('@root/src/middleware/token');


let server = new App();

const swaggerSpec = YAML.load(path.join(__dirname,'./swagger/swagger.yaml'));
server.setSwagger('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerSpec));

server.init();

server.setMiddleware(isExpireToken);
let v1 = '/api/v1'
server.setRouter(v1 + '/user',user);
server.setRouter(v1 + '/heart',heart);


server.start();