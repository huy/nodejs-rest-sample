#!/bin/env node

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

//  OpenShift sample express application
var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());

app.get('/', function(req, res){
    res.send('Hello World');
});

app.post('/', function(req, res) {

    console.log("got req.params: " + req.params);
    console.log("got req.query: " + JSON.stringify(req.query, null, '\t'));
    console.log("got req.body: " + JSON.stringify(req.body, null, '\t'));

    res.send("OK");
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");
