define(['./util', './oo'], function(util, oo) {
  'use strict';
  var db = {};
  var decorator = function(database) {
    var _db = {};
    _db.db = database;
    _db.put = function(storeName, data, success, error) {
      var transaction = this.db.transaction([storeName], 'readwrite');
      var objectStore = transaction.objectStore(storeName);
      if (data instanceof Array) {
        for (var i in data) {
          objectStore.put(data[i]);
        }
        transaction.oncomplete = function(event) {
          if (typeof success === 'function') {
            success(event);
          }
        };
        
        transaction.onerror = function(event) {
          console.error("IndexedDB.add Error: " , event.target);
          if (typeof error === 'function') {
            error(event);
          }
        };
      } else {
        var request = objectStore.put(data);
        request.onerror = function(event) {
          console.error("IndexedDB.add Error: " , event.target);
          if (typeof error === 'function') {
            error(event);
          }
        };
  
        request.onsuccess = function(event) {
          if (typeof success === 'function') {
            success(event);
          }
        };
      }
    }

    _db.get = function(storeName, key, success, error) {
      var request = this.db.transaction([storeName])
        .objectStore(storeName).get(key);
      request.onerror = function(event) {
        console.error("IndexedDB.add Error: " , event.target);
        if (typeof error === 'function') {
          error(event);
        }
      };

      request.onsuccess = function(event) {
        if (typeof success === 'function') {
          success(request.result, event);
        }
      }
    }

    _db.getAll = function(storeName, success, error) {
      var request = this.db.transaction([storeName])
        .objectStore(storeName).openCursor();

      request.onerror = function(event) {
        console.error("IndexedDB.add Error: " , event.target);
        if (typeof error === 'function') {
          error(event);
        }
      };

      var temp = [];
      request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          temp.push(cursor.value);
          cursor.continue();
        } else {
          if (typeof success === 'function') {
            success(temp, event);
          }
        }
      }
    }

    _db.filter = function(storeName, key, success, error) {
      var request = this.db.transaction([storeName])
        .objectStore(storeName).openCursor();

      request.onerror = function(event) {
        console.error("IndexedDB.add Error: " , event.target);
        if (typeof error === 'function') {
          error(event);
        }
      };

      var temp = [];
      request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var rec = cursor.value;
          var flag = false;
          for (var index in rec) {
            if (rec.hasOwnProperty(index)) {
              var value = rec[index];
              if ((typeof value == 'string')) {
                if (value.toLowerCase().indexOf(key.toString().toLowerCase()) != -1) {
                  flag = true;
                } 
              }
              if (typeof value == 'number') {
                if (value.toString().indexOf(key.toString()) != -1) {
                  flag = true;
                }
              }
            }
          }
          if (flag) {
            temp.push(rec);
          }
          cursor.continue();
        } else {
          if (typeof success === 'function') {
            success(temp, event);
          }
        }
      }
    }

    _db.getIndex = function(storeName, indexName, value, success, error) {
      var objectStore = this.db.transaction([storeName]).objectStore(storeName);

      var index = objectStore.index(indexName);
      var request = index.openCursor(IDBKeyRange.only(value))
      request.onerror = function(event) {
        console.error("IndexedDB.add Error: " , event.target);
        if (typeof error === 'function') {
          error(event);
        }
      };

      var temp = [];
      request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          temp.push(cursor.value);
          cursor.continue();
        } else {
          if (typeof success === 'function') {
            success(temp, event);
          }
        }
      };
    }
 
    _db.delete = function(storeName, key, success, error) {
      var request = this.db.transaction([storeName], 'readwrite')
        .objectStore(storeName).delete(key);
      request.onerror = function(event) {
        console.error("IndexedDB.add Error: " , event.target);
        if (typeof error === 'function') {
          error(event);
        }
      };

      request.onsuccess = function(event) {
        if (typeof success === 'function') {
          success(event);
        }
      }
    }
    return _db;
  }

  var createStorage = function(db, name, keypath, indexes) {
    var objectStore = db.createObjectStore(name, { keyPath: keypath });
    $.each(indexes, function(key, value) {
      var indexName = value.name;
      var indexField = value.key || value.name;
      var unique = value.unique;
      objectStore.createIndex(indexName, indexField, { unique: unique });
    });
  }
  db.init = function(opt) {
    var request = indexedDB.open(opt.name, opt.version);

    request.onerror = function(event) {
      console.error("IndexedDB.open Error: " , event);
      if (typeof opt.error === 'function') {
        opt.error(event);
      }
    };

    request.onsuccess = function (event) {
      if (typeof opt.success === 'function') {
        opt.success(decorator(event.target.result), event);
      }
    };

    request.onupgradeneeded = function(event) {
      var _db = event.target.result;
      $.each(opt.stores, function(index, value) {
        createStorage(_db, value.name, value.keypath, value.indexes);
      });
    }
  }
  return db;
});