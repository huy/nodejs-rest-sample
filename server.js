#!/bin/env node

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

//  OpenShift sample express application
var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());

// convenient debug function
function log(message, obj) {
  console.log(message +  ": " + JSON.stringify(obj, null, '\t'));
};

// add working dir to require.path so node.js can find db.js module
require.paths.unshift('.');
var db = require('db');

app.get('/notification/:id', function(req, res){

  db.connect(function(conn){
    log("call db.connect passing conn object", null)});

  res.json({"id" :  req.params.id ,"status": 0, "message": "get notification" });
});

app.post('/notification', function(req, res) {

    log("got req.params", req.params);
    log("got req.query", req.query);
    log("got req.body", req.body);

    res.json({"id": 777, "status": 0, "message": "create new notification" });
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");

