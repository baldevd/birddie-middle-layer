var express = require("express");
var app = express();
var mysql = require('mysql');
var cors = require('cors');
var port = process.env.PORT || 1337;

var connectionPool = mysql.createPool({
    connectionLimit: 10,
    host: "remotemysql.com",
    user: process.env.user,
    password: process.env.ROOTPASS,
    database: process.env.database
});

app.use(cors())
app.use(express.static('client'));

app.listen(port, () => {
    console.log("Server running on port: " + port);
});

app.get('/testEndpoint',(req, res, next) => {
    console.log(req.query.helloWorld);
    res.sendStatus(200);
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

app.get('/prey_order', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        connection.query('SELECT unique(Prey_Order) FROM db ORDER BY ', function (error, results, fields) {
            res.json(results);
            connection.release();
        });
    });
});

app.get('/bird_search', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        console.log(req.query.bird);
        connection.query({
            sql: 'SELECT * FROM `birddietdb` WHERE Common_Name = ?',
            timeout: 10000,
            values: [req.query.bird]
        }, function (error, results, fields) {
            connection.release();
            res.json(results)
        });
    });
});

app.get('/advanced_bird_search', (req, res, next) => {
    connectionPool.getConnection(function (err, connection) {
        console.log(req.query.bird, req.query.yearBegin);
        connection.query({
            sql: 'SELECT * FROM `birddietdb` WHERE Common_Name = ? AND Observation_Year_Begin = ?',
            timeout: 10000,
            values: [req.query.bird, req.query.yearBegin]
        }, function (error, results, fields) {
            connection.release();
            res.json(results)
        });
    });
});

/* Variables
*  @Common_Name VARCHAR(255)
*  @Prey_Taxon_Level ('Kingdom', 'Phylum', 'Class', 'Order', 'Suborder', 'Family', 'Genus', 'Species')
*  @Diet_Type ('Item', 'Wt_or_Vol', 'Occurrence', 'Unspecified') 
*  @Season ('Fall', 'Winter', 'Spring', 'Summer', 'Any')
*  @Region VARCHAR(255)
*  @Year_Begin INT
*  @Year_End INT
*
*  SELECT * FROM birddietdb WHERE Common_Name = @Common_Name          
*                           AND Observation_Year_Begin >= @Year_Begin (0 if unspecified)   `filter1`
*                           AND Observation_Year_End <= @Year_End (2100 if unspecified)     All records for a bird (may be multiple studies)
*
*
*                   |
*                   |  performing another query on the table from the previous query
*                   V
*
*
*  SELECT * FROM `filter1` WHERE Diet_Type IN @Diet_Type
*                          AND Observation_Season IN @Season   `filter2`
*                          AND Location_Region = @Region        Further filters records from `filter1` 
*
*  SELECT UNIQUE(Source, 
*                Observation_Year_Begin, 
*                Observation_Month_Begin, 
*                Observation_Season, 
*                Bird_Sample_Size,                      `Analyses`
*                Habitat_Type,                           Represents different studies of the same species    
*                Location_Region, 
*                Item_Sample_Size, 
*                Diet_Type, 
*                Study_Type) FROM `filter2`
*
*
*  SELECT COUNT* FROM `Analyses`      `numAnalyses`     The number of distinct studies for a given bird species 
*                                                       (Needed for weighted average of occurrence studies)
*
*  SELECT Prey_Order, MAX(Fraction_Diet)/`numAnalyses` FROM `Analyses` WHERE Diet_Type = 'Occurrence'   if by Occurrence (Order is the default taxon)
*                         
*  SELECT Prey_Order, SUM(Fraction_Diet) FROM `Analyses` WHERE Diet_Type = 'Item'  if by Item (Order is the default taxon)
*
*
*/
