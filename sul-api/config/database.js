var mysql = require('mysql');
var async = require('async');

module.exports = function(config, app) {
  var database = {};

  database.getAt = function() {
    return parseInt(Date.now()/1000);
  }
  database.pool = mysql.createPool({
    connectionLimit : 10,
    host            : config.mysql.host,
    user            : config.mysql.user,
    password        : config.mysql.password,
    database        : config.mysql.database,
  });
  database.insert = function(query, data, callback) {
    this.pool.getConnection(function(err, connection) {
      connection.query(query, data, function(err, result) {
        console.log('this.sql', this.sql); //command/query 

        connection.release();
        if (err) {
          console.log(err);
        }

        callback(result);
      });
    });
  }
  database.select = function(query, data, callback) {
    this.pool.getConnection(function(err, connection) {
      connection.query(query, data, function(err, rows) {
        console.log('this.sql', this.sql); //command/query 

        connection.release();

        if (err) {
          console.log(err);
        }
        callback(rows);
      });
    });
  }
  database.query = function(query, data, callback) {
    this.pool.getConnection(function(err, connection) {
      connection.query(query, data, function(err, rows) {
        console.log('this.sql', this.sql); //command/query 

        connection.release();

        if (err) {
          console.log(err);
        }
        callback(rows);
      });
    });
  }

  database.insertUser = function(tablename, user, callback) {
    this.insert('INSERT IGNORE INTO ?? SET ?', [tablename, user], function(result) {
      callback(result);
    });
  }
  database.findUser = function(tablename, auth_id, callback) {
    var where = {
      'auth_id': auth_id,
    };

    this.select('SELECT * FROM ?? WHERE ?', [tablename, where], function(rows) {
      var user = null;

      if (rows.length) {
        user = rows[0];
      }

      callback(user); 
    });
  }

  return database;
};
