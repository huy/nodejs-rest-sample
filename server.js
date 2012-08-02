#!/bin/env node

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

//  OpenShift sample express application
var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());

app.get('/notification/:id', function(req, res){
    res.json({"id" :  req.params.id ,"status": 0, "message": "get notification" });
});

function log(message, obj) {
  console.log(message +  ": " + JSON.stringify(obj, null, '\t'));
}

app.post('/notification', function(req, res) {

    log("got req.params", req.params);
    log("got req.query", req.query);
    log("got req.body", req.body);

    res.json({"id": 777, "status": 0, "message": "create new notification" });
});

var mongo = require('mongodb');

var url = "mongodb://" + process.env.OPENSHIFT_NOSQL_DB_USERNAME +
       ":" + process.env.OPENSHIFT_NOSQL_DB_PASSWORD + "@" +
       process.env.OPENSHIFT_NOSQL_DB_HOST + ":" +
       process.env.OPENSHIFT_NOSQL_DB_PORT + "/" +
       process.env.OPENSHIFT_APP_NAME;

var dbconn;

mongo.connect(url, function(err, conn) {
  conn.on('error', function(err) {
    return console.log('%s: Mongo connect error %s',Date(Date.now()), err);
  });
  dbconn = conn;
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");

