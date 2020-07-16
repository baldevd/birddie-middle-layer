var express = require("express");
var app = express();
var mysql = require('mysql');
const path = require('path');
var cors = require('cors');
var port = process.env.PORT || 1337;

var connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: "database-dept-dietdatabase.cloudapps.unc.edu",
    user: "userFVC",
    password: ROOTPASS,
    database: "birddietdb"
});

//const INDEX = path.join(__dirname, 'client/index.html');
//app.get('/', (req, res) => res.sendFile(INDEX))

app.use(cors())
app.use(express.static('client'));


app.listen(port, () => {
    console.log("Server running on port: " + port);
});

// get all birds?
app.get('/birds', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM `feedback` ORDER BY id DESC LIMIT 100', function (error, results, fields) {
            res.json(results);
            connection.release();
        });
    });
});