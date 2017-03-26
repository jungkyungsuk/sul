var express = require('express');
var waterfall = require("async/waterfall");
var router = express.Router();

module.exports = function(passport, database){
  database.user = {};
  database.user.tablename = 'users';

  database.getPoint = function(id_user) {
    var _return = undefined;
    
    return _return; 
  },
  database.plusPoint = function() {
    waterfall([
        function (callback) {
          database.query('SELECT * FROM ?? WHERE ?', [database.user.tablename, data, where], function(rows) {
            callback(null, rows);
          });
        },
        function (rows, callback) {
          var row = rows[0];
          var id_user = row.id;
          var point = row.point;

        },
    ], function(erro, result) {

    });
  }
  database.minusPoint = function() {
  }

  return router;
}
