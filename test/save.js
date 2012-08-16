
var db = require('db');

db.connect(function(conn){
  conn.collection('doc', function (err, collection) {
    collection.findOne({"_id": db.ObjectID('501c9c5586601f2d09000001')}, function (err, doc) {
      console.log("findOne from doc return");
      
      if(doc) {
        
        console.log("update doc");

        collection.save(doc, {safe: true}, function (err,result){

          console.log("collection.save return err " + err);
          console.log("collection.save return " + result);

        });
      }; 
      
      conn.close();
    });
  });
});
