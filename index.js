'use strict';

function puts(entries) {
  return Object.keys(entries)
    .map(function (k) {
      return { type: 'put', key: k, value: entries[k] };
    });
}

var store = module.exports = function (db, entries, cb) {
  var countries = db.sublevel('countries', { valueEncoding: 'json' })
    , byLanguage =  db.sublevel('byLanguage', { valueEncoding: 'utf8'})

  countries.pre(function (val, add) {
    add({ prefix :  byLanguage
        , type   :  'put'
        , key    :  val.value.language
        , value  :  val.key
    });
  });

  countries.batch(puts(entries), function (err) {
    cb(err, { countries: countries, byLanguage: byLanguage })  
  });
};


var level    =  require('level-test')( { mem: true })
  , sublevel =  require('level-sublevel')
  , dump     =  require('level-dump')
  , db       =  sublevel(level(null, { valueEncoding: 'json' }));

var countries = {
     USA:       { language: 'English' ,  capital: 'Washington DC' }
  ,  Australia: { language: 'English' ,  capital: 'Canbera'       }
  ,  Germany:   { language: 'German'  ,  capital: 'Berlin'        }
  ,  Austria:   { language: 'German'  ,  capital: 'Vienna'        }
};

store(db, countries, function (err, sublevels) {
  if (err) return console.error(err);
  console.log('\n=== dump ===')
  // dump(db);                // dumps nothing since countries are separated from root db
  // dump.allEntries(db)      // dumps entire db including sublevels and shows how keys are namespaced
  // dump(sublevels.countries);
  dump(sublevels.byLanguage);
});
