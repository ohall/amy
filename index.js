#!/usr/bin/env node
/**
 * Created by Oakley Hall on 3/3/17.
 */

const https = require('https');
const _ = require('lodash');
const fs = require('fs');
const email = require('./email');

const daysInWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const foods = ['chicken', 'beef', 'taco', 'crockpot', 'pasta', 'salad', 'ramen'];

let menu = [];
let list = [];

const error = e => { console.error(e); };

const getMenuItem = (day,index, food, callback) => {

  const options = {
    hostname: 'api.edamam.com',
    port: 443,
    path: '/search?q=' + food +
    '&app_id=' + process.env.EDAMAM_ID +
    '&app_key=' + process.env.EDAMAM_KEY +
    '&from=1&to=50',
    method: 'GET'
  };

  const req = https.request(options, res => {
    let data= '';
    res.on('data', d => { data += d; });
    res.on('end', () => {
      const hits = JSON.parse(data).hits;
      const wanted = _.map(hits, hit => {
        return {
          index: index,
          day: day,
          name: hit.recipe.label,
          url: hit.recipe.url,
          ingredients: hit.recipe.ingredientLines
        }
      });

      const chosen = _.sample(wanted);
      menu.push(chosen);
      list = _.concat(list, chosen.ingredients);
      callback();
    });
  });

  req.on('error', (e) => { callback(e); });
  req.end();
};

_.each(daysInWeek, (day, index) => {
  getMenuItem(day, index, _.sample(foods), e => {
    if(e){ console.log( e );}
    if( menu.length === daysInWeek.length ){
      menu = _.sortBy(menu, item => item.index);
      email(error, menu);
      fs.writeFileSync('menu', JSON.stringify( menu, null, 2) );
      fs.writeFileSync('list', JSON.stringify( list, null, 2) );
    }
  });
});

