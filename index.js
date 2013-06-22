'use strict';

function puts(entries) {
  return Object.keys(entries)
    .map(function (k) {
      return { type: 'put', key: k, value: entries[k] };
    });
}

var store = module.exports = function (db, entries, cb) {
  var countries = db.sublevel('countries', { valueEncoding: 'json' })
    , byCapital  =  db.sublevel('byCapital', { valueEncoding: 'utf8' })
    , byLanguage =  db.sublevel('byLanguage', { valueEncoding: 'utf8'});

  countries.pre(function (val, add) {
    add({ prefix :  byCapital
        , type   :  'put'
        , key    :  val.value.capital
        , value  :  val.key
    });
  });

  countries.pre(function (val, add) {
    add({ prefix :  byLanguage
        , type   :  'put'
        , key    :  val.value.language + '\xff' + val.key
        , value  :  val.key
    });
  });
  countries.batch(puts(entries), function (err) {
    cb(err, { countries: countries, byCapital: byCapital, byLanguage: byLanguage })  
  });
};
