#!/bin/env node

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

//  OpenShift sample express application
var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());

app.get('/', function(req, res){
    res.json({"status": 0, "message": "hello world" });
});

function log(message, obj) {
  console.log(message +  ":" + JSON.stringify(obj, null, '\t'));
}

app.post('/', function(req, res) {

    log("got req.params: ", req.params);
    log("got req.query: ", req.query);
    log("got req.body: ", req.body);

    res.json({"status": 0, "message": "hello world" });
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");

