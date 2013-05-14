/**
 * Very basic CRUD route creation utility for models.
 * For validation, simply override the model's save method.
 */

(function (exports) {

  "use strict";

  function errMsg(msg) {
    return {'error': {'message': msg.toString()}};
  }

  //------------------------------
  // List
  //
  function getListController(model) {
    return function (req, res) {
      //console.log('list', req.body);
      model.find({}, function (err, result) {
        if (!err) {
          res.send(result);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Search word array
  //
  function searchWordArray(model) {
    return function (req, res) {
      var callback = req.param("callback") ? req.param("callback") : "";

      console.log(req.param("wordArray"))
      //This checks whether the client even sent anything at all and if it did assigns it
      if (req.param("wordArray") != undefined) {
        var wordArray = req.param("wordArray"); 
      } else {
        res.send(JSON.stringify({'result': null, 'status': 400, 'message': 'no input array'}))
        return;
      }


      model.findByRegex( wordArray, function (err, result) {
        if (!err) {
          res.send( callback+"("+JSON.stringify(result)+")" );
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Create
  //
  function getCreateController(model) {
    return function (req, res) {
      var m = new model(req.body);
      console.log('create', m);

      m.save(function (err) {
        if (!err) {
          res.send(m);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Read
  //
  function getReadController(model) {
    return function (req, res) {
      //console.log('read', req.body);
      model.findById(req.params.id, function (err, result) {
        if (!err) {
          res.send(result);
        } else {
          res.send(errMsg(err));
        }
      });
    };
  }

  //------------------------------
  // Update
  //
  function getUpdateController(model) {
    return function (req, res) {
      //console.log('update', req.body);
      model.findById(req.params.id, function (err, result) {
        var key;
        for (key in req.body) {
          result[key] = req.body[key];
        }
        result.save(function (err) {
          if (!err) {
            res.send(result);
          } else {
            res.send(errMsg(err));
          }
        });
      });
    };
  }

  //------------------------------
  // Delete
  //
  function getDeleteController(model) {
    return function (req, res) {
      //console.log('delete', req.body);
      model.findById(req.params.id, function (err, result) {
        if (err) {
          res.send(errMsg(err));
        } else {
          result.remove();
          result.save(function (err) {
            if (!err) {
              res.send({});
            } else {
              res.send(errMsg(err));
            }
          });
        }
      });
    };
  }

  exports.initRoutesForModel = function (options) {
    var app = options.app,
      model = options.model,
      path,
      pathWithId;

    if (!app || !model) {
      return;
    }

    path = options.path || '/' + model.modelName.toLowerCase();
    pathWithId = path + '/:id';
    app.get(path, getListController(model));
    app.post(path, getCreateController(model));
    app.get('/search', searchWordArray(model));
    app.get(pathWithId, getReadController(model));
    app.put(pathWithId, getUpdateController(model));
    app.del(pathWithId, getDeleteController(model));
  };

}(exports));
