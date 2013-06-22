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

  t.plan(4)
  store(db, countries, function (err, sublevels) {
    if (err) console.error(err);
    t.notOk(err, 'stores without error')

    t.test('\n# stores countries correctly', function (t) {
      
      var countries = []
      dump(
          sublevels.countries
        , [].push.bind(countries)
        , function () {

            t.deepEqual(
                countries
              , [ { key: 'Australia',
                    value: { language: 'English', capital: 'Canbera' } },
                  { key: 'Austria',
                    value: { language: 'German', capital: 'Vienna' } },
                  { key: 'Germany',
                    value: { language: 'German', capital: 'Berlin' } },
                  { key: 'USA',
                    value: { language: 'English', capital: 'Washington DC' } } ]
            )

            t.end()
        }
      )
    })

    t.test('\n# indexes by capital', function (t) {
      
      var capitals = []
      dump(
          sublevels.byCapital
        , [].push.bind(capitals)
        , function () {

            t.deepEqual(
                capitals
              , [ { key: 'Berlin', value: '"Germany"' },
                  { key: 'Canbera', value: '"Australia"' },
                  { key: 'Vienna', value: '"Austria"' },
                  { key: 'Washington DC', value: '"USA"' } ]
            )

            t.end()
        }
      )
    })

    t.test('\n# indexes by language', function (t) {
      
      var languages = []
      dump(
          sublevels.byLanguage
        , [].push.bind(languages)
        , function () {

            t.deepEqual(
                languages
              , [ { key: 'EnglishÿAustralia', value: '"Australia"' },
                  { key: 'EnglishÿUSA', value: '"USA"' },
                  { key: 'GermanÿAustria', value: '"Austria"' },
                  { key: 'GermanÿGermany', value: '"Germany"' } ]
              , 'creates multiple indexes if a language is spoken in multiple countries' 
            )

            t.end()
        }
      )
    })
 
  })
})
