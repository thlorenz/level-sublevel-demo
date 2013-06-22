'use strict';

var store = module.exports = function (db, countries, cb) {

};





if (module.parent) return;

var level    =  require('level-test')( { mem: true })
  , sublevel =  require('level-sublevel')
  , db       =  sublevel(level(null, { valueEncoding: 'json' }));

var countries = {
     USA:       { language: 'English' ,  capital: 'Washington DC' }
  ,  Australia: { language: 'English' ,  capital: 'Canbera'       }
  ,  Germany:   { language: 'German'  ,  capital: 'Berlin'        }
  ,  Austria:   { language: 'German'  ,  capital: 'Vienna'        }
};
