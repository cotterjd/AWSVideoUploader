

var mysql = require('mysql'),
    config = require('../config');

var connection = mysql.createConnection(config.mysql);

exports.connection = connection;
