var mongo = require('mongodb');

var url = "mongodb://" + process.env.OPENSHIFT_NOSQL_DB_USERNAME +
       ":" + process.env.OPENSHIFT_NOSQL_DB_PASSWORD + "@" +
       process.env.OPENSHIFT_NOSQL_DB_HOST + ":" +
       process.env.OPENSHIFT_NOSQL_DB_PORT + "/" +
       process.env.OPENSHIFT_APP_NAME;

exports.connect = function (callback) {
  
  mongo.connect(url, function(err, conn) {
    conn.on('error', function(err) {
      console.log('%s: Mongo connect error %s',Date(Date.now()), err);
      return undefined;
    });

    console.log('%s: Mongo connect success',Date(Date.now()));

    return callback(conn);
  });
}

