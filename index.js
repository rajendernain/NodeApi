const con = require('./db/connection');
const routes = require('./route');
global.constants = require('./constants');
const express = require('express');
const app = express();

app.use(express.json());

app.use(routes);

app.listen(constants.PORT);


module.exports=app;