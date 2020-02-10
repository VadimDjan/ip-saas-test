exports.sqlToPromise = function (sqlQuery) {
    var resultDeferred = protractor.promise.defer();
    protractor.libs.pg.connect(protractor.helpers.connectionString, function(err, client, done) {
          if(err) {
              resultDeferred.reject(err);
              return console.error('error fetching client from pool', err);
          }
          /**
          result = {
              command: 'SELECT'/'UPDATE'/...
              rowCount: число строк
              oid: NaN
              rows: массив строк результата
          }
          */
          client.query(sqlQuery, function(err, result) {
                    done();//call `done()` to release the client back to the pool
                  if(err) {
                      resultDeferred.reject(err);                      
                      return console.error('error running query', err);
                  }
                  resultDeferred.fulfill(result);
          });
    });
    return resultDeferred.promise;
};
