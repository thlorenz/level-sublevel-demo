'use strict';

var level    =  require('level-test')( { mem: true })
  , sublevel =  require('level-sublevel')
  , dump     =  require('level-dump')
  , db       =  sublevel(level(null, { valueEncoding: 'json' }))
  , test     =  require('tap').test
  , store    =  require('..')

var countries = {
     USA:       { language: 'English' ,  capital: 'Washington DC' }
  ,  Australia: { language: 'English' ,  capital: 'Canbera'       }
  ,  Germany:   { language: 'German'  ,  capital: 'Berlin'        }
  ,  Austria:   { language: 'German'  ,  capital: 'Vienna'        }
};

test('\nstoring countries', function (t) {

  t.plan(1)
  store(db, countries, function (err, sublevels) {
    if (err) console.error(err);
    t.notOk(err, 'stores without error')


  })
})
