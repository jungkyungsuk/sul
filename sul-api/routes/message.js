var express = require('express');
var router = express.Router();

module.exports = function(passport, database){
  database.message = {};
  database.message.tablename = 'message';
  database.message.find = function(callback, data, where)  {
    database.query('SELECT * FROM ?? WHERE', [database.message.tablename, where], function(rows) {
      callback(rows);
    }); 
  }
  database.message.insert = function(callback, data) {
    database.query('INSERT IGNORE INTO ?? SET ?', [database.message.tablename, data], function(result) {
      callback(result);
    });
  }

  //router
  router.post('/send', function(req, res, next) {
    var data = { 
      id_user_sending: req.user.id,
      id_user_receiving: req.body.id_user,
      text: req.body.text,
      at: database.getAt(),
    };
    database.message.insert(function(result) {
      var result = {};
      if (result.affectedRows) {
        result.id = result.insertId;
      }
      res.json(result);
    });
  });
  router.get('/list', function(req, res, next) {
    var data = {
      id_user_receiving: req.user.id,
    }
    database.message.find(function(rows) {
      res.json(rows);
    }, data);
  });
  router.get('/:id', function(req, res, next) {
    var data = {
      id: req.params.id,
    }
    database.message.find(function(rows) {
      res.json(rows[0]);
    }, data);
  });
  return router;
}
