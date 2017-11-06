/**
 * @Tabris-NeDB
 * Adapter for the Filesystem of node.js, but only the functions needed by NeDB!
 * Can be used to extend the funtions of Tabris-Filesystem fs.
 * The original Tabris-Filesystem fs can be used through <imported fs>.tabris.<Tabris-Filesystem fs function>
 *
 * mkdirp DOESNT WORK, it throws an error if the directory doesnt exists
 * TODO: remove Workaround for mkdirp
 */

const {
  fs
} = require('tabris');
var storage = {};

storage.filesDir = fs.filesDir;
storage.cacheDir = fs.cacheDir;

storage.tabris = {};

storage.tabris.readDir = fs.readDir;
storage.tabris.readFile = fs.readFile;
storage.tabris.removeFile = fs.removeFile;
storage.tabris.writeFile = fs.writeFile;

storage.tabris.filesDir = fs.filesDir;
storage.tabris.cacheDir = fs.cacheDir;

storage.ensureEncoding = function (encoding) {
  if (encoding === 'utf8') {
    return 'utf-8'
  }
};

storage.exists = function(path, cb, encoding = 'utf-8') {
  encoding = storage.ensureEncoding(encoding);
  fs.readFile(path, encoding).then(function(contentString) {
    return cb(true, contentString);
  }).catch(function(err) {
    return cb(false, "", err);
  });
};

storage.appendFile = function(path, text, encoding, cb) {
  encoding = storage.ensureEncoding(encoding);
  storage.exists(path, function(exists, contentString, err) {
    fs.writeFile(path, text + contentString, encoding).then(function() {
      return cb();
    }).catch(function(err) {
      return cb(err);
    });
  }, encoding);
};

storage.readFile = function(path, encoding = 'utf-8', cb) {
  encoding = storage.ensureEncoding(encoding);
  fs.readFile(path, encoding).then(function(contentString) {
    return cb(undefined, contentString);
  }).catch(function(err) {
    return cb(err);
  });
}

//writeFile(path,data,cb)||(path,data,encoding,cb)
storage.writeFile = function(path, data, encoding, cb) {
  cb = arguments[arguments.length - 1];
  encoding = typeof encoding == 'string'? storage.ensureEncoding(encoding) : 'utf-8';
  fs.writeFile(path, data, encoding).then(function() {
    return cb();
  }).catch(function(err) {
    return cb(err);
  });
}

storage.unlink = function(path, cb) {
  fs.removeFile(path).then(function() {
    return cb();
  }).catch(function(err) {
    return cb(err);
  });
};

storage.rename = function(oldPath, newPath, cb) {
  storage.exists(oldPath, function(exists, contentString, err) {
    if (exists) {
      fs.writeFile(newPath, contentString).then(function() {
        storage.unlink(oldPath, function(err) {
          return cb(err);
        });
      }).catch(function(err) {
        return cb(err);
      });
    } else {
      return cb(err);
    }
  });
};

//Erstellt KEINE directories sondern wirft einen Fehler wenn die directory nicht existiert
storage.mkdirp = function(path, cb) {
  fs.readDir(path).then(function(filesArray) {
    return cb();
  }).catch(function(err) {
    return cb(err);
  });
};



module.exports = storage;
