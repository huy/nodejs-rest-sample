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
  if( typeof obj !== "undefined" )	
    console.log(message +  ": " + JSON.stringify(obj, null, '\t'));
  else
    console.log(message);
};

var db = require('db');

app.get('/notification/:id', function(req, res){

  db.connect(function(conn){
    log("call db.connect passing conn object to callback");
    
    conn.collection('doc', function(err, collection) {
      var result = collection.find().toArray(function(err, items) {});

      log("call find on collection doc", result);

      if( typeof result !== "undefined" && result.length > 0 ) 
        res.json(result.shift());

    });

  });

  res.json({"id": req.params.id, "status": "notfound"});
});

app.post('/notification', function(req, res) {

  log("got req.params", req.params);
  log("got req.query", req.query);
  log("got req.body", req.body);

  var sample = {"id": 7, "message": "sample notification" };

  db.connect(function(conn){
    conn.collection('doc', function(err, collection) {
      collection.insert(sample, {safe:true}, function(err,result) {
        log("insert doc to returns " + err, result);
      });
    });
  });

  res.json(sample);
});

app.listen(port,ipaddr);

console.log("Server running at http://" + ipaddr + ":" + port + "/");

