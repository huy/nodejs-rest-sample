#!/bin/env node
'use strict';

var _ = require('underscore');

// openshift or local
var ipaddr  = process.env.OPENSHIFT_INTERNAL_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_INTERNAL_PORT || 8080;

var express = require('express');
var app = express.createServer();

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

// convenient debug function
function log(message, obj) {
  if (typeof obj !== 'undefined') {
    console.log(message +  ": " + JSON.stringify(obj, null, '\t'));
  } else {
    console.log(message);
  }
}

var db = require('db');

function createFilter(query) {
  var acceptedFields = {'name': _.identity,
        'desc': _.identity,
        'a': parseInt,
        'b': _.identity},
    filter = {};

  _.each(acceptedFields, function (v, k) {
    if (typeof query[k] !== 'undefined') {
      filter[k] = v(query[k]);
    }
  });
  return filter;
}

app.get('/notification', function (req, res) {
  log("got req.query", req.query);

  var filter = createFilter(req.query);

  log("set query filter to", filter);

  db.connect(function (conn) {
    conn.collection('doc', function (err, collection) {

      collection.find(filter).toArray(function (err, items) {
        log("find from doc return", items);

        conn.close();

        if (err) {
          res.json({status: err});
        } else {
          if (items && items.length > 0) {
            res.json({status: "found", result: items});
          } else {
            res.json({status: "notfound", result: []});
          }
        }
      });
    });
  });
});

app.get('/notification/:id', function (req, res) {
  var objectId = db.parseObjectId(req.params.id);

  if (objectId) {
    db.doc.id(objectId, function (conn, collection, err, doc) {
      conn.close();
      if (err) {
        res.json({status: err});
      } else {
        if (doc) {
          res.json({status: "found", result: doc});
        } else {
          res.json({status: "notfound"});
        }
      }
    });
  } else {
    res.json({status: "wrong format of input id"});
  }
});

app.post('/notification', function (req, res) {

  log("got req.body", req.body);

  db.connect(function (conn) {
    conn.collection('doc', function (err, collection) {
      collection.insert(req.body, {safe: true}, function (err, result) {

        log("insert to doc returns", err);
        log("insert to doc returns", result);
        conn.close();

        if (!err) {
          res.json({status: 'ok', result : result[0]});
        } else {
          res.json({status: err});
        }
      });
    });
  });
});

app.put('/notification/:id', function (req, res) {
  var objectId, attrname;

  log("got req.body", req.body);
  log("got req.params.id", req.params.id);

  objectId = db.parseObjectId(req.params.id);

  if (objectId) {
    db.doc.id(objectId, function (conn, collection, err, doc) {
      log("findOne from doc return", doc);

      if (err) {
        res.json({status: err});
      } else {
        if (doc) {
          doc = req.body;
          doc._id = objectId;

          log("after update doc from req.body", doc);

          collection.save(doc, {safe: true}, function (err, result) {

            log("collection.save return err", err);
            log("collection.save return", result);

            if (err) {
              res.json({status: err});
            } else {
              res.json({status: "success", result: doc});
            }
            conn.close();
          });
        } else {
          res.json({status: "notfound"});
          conn.close();
        }
      }
    });
  } else {
    res.json({status: "wrong format of input id"});
  }
});

app.delete('/notification/:id', function (req, res) {
  var objectId;

  log("got req.params.id", req.params.id);

  objectId = db.parseObjectId(req.params.id);

  if (objectId) {
    db.connect(function (conn) {
      conn.collection('doc', function (err, collection) {

        collection.findAndRemove({"_id": objectId}, {safe: true}, function (err, doc) {
          if (err) {
            res.json({status: err});
          } else {
            if (doc) {
              res.json({status: "ok" });
            } else {
              res.json({status: "notfound"});
            }
          }
        });
      });
    });
  } else {
    res.json({status: "wrong format of input id"});
  }
});

app.delete('/notification', function (req, res) {
  var filter;

  log("got req.query", req.query);

  filter = createFilter(req.query);

  log("set delete filter to", filter);

  db.connect(function (conn) {
    conn.collection('doc', function (err, collection) {

      collection.remove(filter, {safe: true}, function (err, items) {
        log("remove from doc return", items);

        conn.close();

        if (err) {
          res.json({status: err});
        } else {
          if (items) {
            res.json({status: "ok", result: items});
          } else {
            res.json({status: "ok", result: 0});
          }
        }
      });
    });
  });
});

app.listen(port, ipaddr);

log("Server running at http://" + ipaddr + ":" + port + "/");

