const fetch = require('node-fetch');
const _ = require('lodash');
const email = require('./email');
const { menuLength, requestDelayMS, foods } = require('../config.json');

const error = console.error;
const menu = [];

async function getMenuItem (food) {
  const { EDAMAM_ID, EDAMAM_KEY } = process.env;
  const url = `https://api.edamam.com/search?q=${food}&app_id=${EDAMAM_ID}&app_key=${EDAMAM_KEY}&from=1&to=50`;
  let responseJSON, response;

  try {
    response = await fetch(url);
    responseJSON = await response.json();
  } catch (e) {
    error(e);
    error(response);
    return;
  }
  return _.get(_.sample(responseJSON.hits), 'recipe'); // randomly select one of the hits
}

async function makeMenu() {
  for(let i = 0; i < menuLength; i++){
    await new Promise(resolve => setTimeout(resolve, requestDelayMS));
    const menuItem = await getMenuItem(_.sample(foods));

    if(menuItem) menu.push(menuItem);

    if( i >= menuLength - 1 ) email(error, menu);
  }
}

module.exports = makeMenu;
