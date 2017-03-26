var express = require('express');
var router = express.Router();
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

module.exports = function(config, passport, database){
  var s3 = new aws.S3({
    signatureVersion: 'v4',
  });

  var upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: config.aws.bucket,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        //cb(null, Date.now().toString())
        cb(null, 'images/'+file.originalname);
      },
    })
  })

  database.post = {};
  database.post.tablename = 'posts';
  database.post.insert = function(callback, data) {
    database.query('INSERT IGNORE INTO ?? SET ?', [this.tablename, data], function(result) {
      callback(result);
    });
  }
  database.post.find = function(callback, data) {
    database.query('SELECT * FROM ?? WHERE ?', [this.tablename, data], function(rows) {
      callback(rows);
    });
  }
  database.post.update = function(callback, data, where) {
    database.query('UPDATE ?? SET ? WHERE ?', [this.tablename, data, where], function(result) {
      callback(rows);
    });
  }
  database.post.list = {};
  database.post.list.latest = function(callback, where) {
    if (typeof where === 'object' && where.id ) { 
      database.query('SELECT * FROM ?? WHERE id < ?? ORDER BY id LIMIT 30', [this.tablename, where.id], function(rows) {
        callback(rows);
      });
    } else {
      database.query('SELECT * FROM ?? ORDER BY id LIMIT 30', [this.tablename], function(rows) {
        callback(rows);
      });
    }
  }
  database.post.user = function(callback, where) {
    if (typeof where === 'object' && where.id ) { 
      database.query('SELECT * FROM ?? WHERE id_user = ?? AND id < ?? ORDER BY id LIMIT 30', [this.tablename, where.user_id, where.id], function(rows) {
        callback(rows);
      });
    } else {
      database.query('SELECT * FROM ?? WHERE id_user = ?? ORDER BY id LIMIT 30', [this.tablename, where.user_id], function(rows) {
        callback(rows);
      });
    }
  }

  // router
  router.get('/form', function(req, res, next) {
    res.render('post/form');
  });
  router.post('/', upload.single('image'), function(req, res, next) {
    var data = { 
      text: req.body.text,
      id_user: req.user.id,
      at: database.getAt(),
    };
    if (req.file) {
      data.path_img = req.file.key;
    }
    database.post.insert(function(result) {
      var _return = {};
      if (result.affectedRows) {
        _return.id = result.insertId;
      }
      res.json(_return);
    }, data);
  });
  router.get('/:id', function(req, res, next) {
    var data = {
      id: req.params.id,
    }
    database.post.find(function(rows) {
      res.json(rows[0]);
    }, data);
  });
  router.put('/:id', function(req, res, next) {
    var result = {};
    var data = { 
      text: req.body.text,
      path_img: req.file.path,
    };
    var where = {
      id: req.params.id,
      id_user: req.user.id,
    };
    database.post.update(function(result) {
      if (result.affectedRows) {
        result.id = result.insertId;
      }
      res.json(result);
    }, data, where);
  });
  router.delete('/:id', function(req, res, next) {
    var data = { 
      state: 0,
    };
    var where = {
      id: req.params.id,
      id_user: req.user.id,
    };
    database.post.update(function(result) {
      if (result) {
        res.send(result);
      }
    }, data, where);
  });
  router.get('/list/latest', function(req, res, next) {
    if (req.query.id) {
      var where = {id: req.query.id};
      database.post.list.latest(function(rows) {
        res.json(rows);
      }, where);
    } else {
      database.post.list.latest(function(rows) {
        res.json(rows);
      });
    }
  });
  router.get('/list/user/:id', function(req, res, next) {
    var where = {
      id_user: req.params.id,
    };
    if (req.query.id) {
      where.id =  req.query.id;
    }

    database.post.user(function(rows) {
      res.json(rows);
    }, where);
  });
  return router;
}
