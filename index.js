'use strict';

function puts(entries) {
  return Object.keys(entries)
    .map(function (k) {
      return { type: 'put', key: k, value: entries[k] };
    });
}

var store = module.exports = function (db, entries, cb) {
  var countries = db.sublevel('countries', { valueEncoding: 'json' })
    , byCapital  =  db.sublevel('byCapital', { valueEncoding: 'utf8' });

  countries.pre(function (val, add) {
    add({ prefix :  byCapital
        , type   :  'put'
        , key    :  val.value.capital
        , value  :  val.key
    });
  });

  countries.batch(puts(entries), function (err) {
    cb(err, { countries: countries, byCapital: byCapital })  
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

function whoseCapitalIs(capital, sublevels) {
  sublevels.byCapital.get(capital, function (err, country) {
    if (err) return console.error(err);
    console.log('%s is the capital of %s.', capital, country);
  });
}

store(db, countries, function (err, sublevels) {
  if (err) return console.error(err);
  console.log('\n=== dump ===')
  // dump(db);                // dumps nothing since countries are separated from root db
  // dump.allEntries(db)      // dumps entire db including sublevels and shows how keys are namespaced
  // dump(sublevels.countries);
  dump(sublevels.byCapital);
  // whoseCapitalIs('Berlin', sublevels);
});

