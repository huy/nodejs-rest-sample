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
      var result = []; 
      
      log("call collection find with id " + req.params.id);

      var id = parseInt(req.params.id);
      collection.find({"id": id }).toArray(function(err, items) {
        log("find from doc return " + err, items);
	
	conn.close();

	if(err)
	   res.json({"status": err});
        else {	
          if(items && items.length > 0)
	    res.json(items.shift());
          else
            res.json({"status": "notfound"});
        }
      });
    });
  });

});

app.post('/notification', function(req, res) {

  log("got req.params", req.params);
  log("got req.query", req.query);
  log("got req.body", req.body);

  db.connect(function(conn){
    conn.collection('doc', function(err, collection) {
      collection.insert(req.body, {safe:true}, function(err,result) {
        
	log("insert to doc returns " + err, result);
	conn.close();

	if(!err)
	  res.json(result.shift());
        else
	  res.json({"status": err});
      });
    });
  });
});

app.put('/notification/:id', function(req, res){

});

app.listen(port,ipaddr);

log("Server running at http://" + ipaddr + ":" + port + "/");

