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
  if( typeof obj !== 'undefined' )	
    console.log(message +  ": " + JSON.stringify(obj, null, '\t'));
  else
    console.log(message);
};

var db = require('db');

app.get('/notification', function(req,res) {
  db.connect(function(conn){
    conn.collection('doc', function(err, collection) {
      log("got req.query", req.query);
      
      var acceptedFields = ['name','desc','a','b'];

      var filter = {};
      for (var i = 0; i < acceptedFields.length; i++) {
        if(typeof req.query[acceptedFields[i]] !== 'undefined')
          filter[acceptedFields[i]] = req.query[acceptedFields[i]];
      }
 
      log("set filter to", filter);
 
      collection.find(filter).toArray(function(err, items) {
        log("find from doc return", items);
	
	conn.close();

	if(err)
	   res.json({"status": err});
        else {	
          if(items && items.length > 0)
	    res.json({"status": "found", "result": items});
          else
            res.json({"status": "notfound"});
        }
      });      
    });
  });
});

app.get('/notification/:id', function(req, res){

  db.connect(function(conn){
    conn.collection('doc', function(err, collection) {
      
      log("call collection find with id " + req.params.id);

      collection.findOne({"_id": db.ObjectID(req.params.id) }, function(err, doc) {
        log("find from doc return", doc);
	
	conn.close();

	if(err)
	   res.json({"status": err});
        else {	
          if(doc)
	    res.json({"status": "found", "result": doc});
          else
            res.json({"status": "notfound"});
        }
      });
    });
  });

});

app.post('/notification', function(req, res) {

  log("got req.body", req.body);

  db.connect(function(conn){
    conn.collection('doc', function(err, collection) {
      collection.insert(req.body, {safe:true}, function(err,result) {
        
	log("insert to doc returns", result);
	conn.close();

	if(!err)
	  res.json({ "status": "success", "result" : result });
        else
	  res.json({"status": err});
      });
    });
  });
});

app.put('/notification/:id', function(req, res){
  log("got req.body", req.body);
  log("got req.params", req.params);
  
  collection.findOne({"_id": db.ObjectID(req.params.id) }, function(err, doc) {
    log("find from doc return", doc);
    
    if(err)
      res.json({"status": err});
    else {
      if(doc) {
	for (var attrname in req.body) {
          doc[attrname] = req.body[attrname];
	}
        collection.save(doc, {safe:true},function(err,result){
	  if(err)
            res.json({"status": err});
	  else
            res.json({"status": "success", "result": result});
	});
      }
    };
    conn.close();
  });
});

app.listen(port,ipaddr);

log("Server running at http://" + ipaddr + ":" + port + "/");

