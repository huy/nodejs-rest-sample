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

    console.log("got req: " + req);
    console.log("got req.params: " + req.params);
    console.log("got req.query: " + JSON.stringify(req.query, null, '\t'));
    console.log("got req.body: " + req.body);

    res.send("OK");
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");
