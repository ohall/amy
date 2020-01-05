'use strict';
const makeMenu = require('./lib/makeMenu');
const express = require('express');
const app = express();
const bunyan = require('bunyan');
const log = bunyan.createLogger({name: 'amy'});
const port = 3000;

app.get('/makeMenu', makeMenu(log));

app.listen(port, () => log.info(`Amy listening on port ${port}`));
