#!/usr/bin/env node
/**
 * Created by Oakley Hall on 3/3/17.
 */

const https = require('https');
const _ = require('lodash');
const fs = require('fs');
const email = require('./email');
const QUERY = 'chicken&beef&taco&crockpot&pasta&quick&easy&casserole';

const error = e => { console.error(e); };

const getMenuItem = (queryParam, callback) => {

  const options = {
    hostname: 'api.edamam.com',
    port: 443,
    path: '/search?q=' + queryParam +
    '&app_id=' + process.env.EDAMAM_ID +
    '&app_key=' + process.env.EDAMAM_KEY +
    '&from=1&to=20',
    method: 'GET'
  };

  const req = https.request(options, res => {
    let data= '';
    res.on('data', d => { data += d; });
    res.on('end', () => {
      const hits = JSON.parse(data).hits;
      const wanted = _.map(hits, hit => {
        return {
          name: hit.recipe.label,
          url: hit.recipe.url,
          ingredients: hit.recipe.ingredientLines
        }
      });

      const chosen = _.sampleSize(wanted, 10);
      const list = _.concat([], chosen.ingredients);
      callback(null, chosen, list);
    });
  });

  req.on('error', (e) => { callback(e); });
  req.end();
};

getMenuItem(QUERY, (e, menu, shoppingList) => {
  if(e){ console.log( e );}
  email(error, menu);
  fs.writeFileSync('menu', JSON.stringify( menu, null, 2) );
  fs.writeFileSync('list', JSON.stringify( shoppingList, null, 2) );
});


