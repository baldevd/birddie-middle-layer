var express = require("express");
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var port = process.env.PORT || 1337;

var connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: "database-dept-dietdatabase.cloudapps.unc.edu",
    user: "root",
    password: process.env.ROOTPASS,
    database: "birddietdb"
});

app.use(cors())
app.use(express.static('client'));

app.listen(port, () => {
    console.log("Server running on port: " + port);
});

// get all birds?
app.get('/prey_order', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        connection.query('SELECT unique(Prey_Order) FROM db ORDER BY ', function (error, results, fields) {
            res.json(results);
            connection.release();
        });
    });
});

app.get('/prey_order', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        connection.query('SELECT unique(Prey_Order) FROM db ORDER BY ', function (error, results, fields) {
            res.json(results);
            connection.release();
        });
    });
});

app.post('/bird_search', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        console.log(req.query.bird);
        connection.query({
            sql: 'INSERT INTO `feedback`(`feedback`) VALUES (?)',
            timeout: 10000,
            values: [req.query.bird]
        }, function (error, results, fields) {
            connection.release();
            res.sendStatus(200)
        });
    });
});
