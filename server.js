#!/bin/env node

//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

//  OpenShift sample express application
var app = require('express').createServer();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.post('/', function(req, res) {
    console.log("got" + req);
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");
