const fetch = require('node-fetch');
const _ = require('lodash');
const email = require('./email');
const { menuLength, requestDelayMS, foods } = require('../config.json');
const menu = [];
let log;

async function getMenuItem (food) {
  const { EDAMAM_ID, EDAMAM_KEY } = process.env;
  const url = `https://api.edamam.com/search?q=${food}&app_id=${EDAMAM_ID}&app_key=${EDAMAM_KEY}&from=1&to=50`;
  let responseJSON, response;

  try {
    response = await fetch(url);
    log.info({type: 'API_RESPONSE', code: response.code});
    responseJSON = await response.json();
  } catch (e) {
    log.error(e);
    throw e;
  }
  return _.get(_.sample(responseJSON.hits), 'recipe'); // randomly select one of the hits
}

async function makeMenu(req, res) {
  for(let i = 0; i < menuLength; i++){
    await new Promise(resolve => setTimeout(resolve, requestDelayMS));
    let menuItem;
    try {
      menuItem = await getMenuItem(_.sample(foods));
    } catch (e) {
      log.error({type: 'MENU_ITEM_ERROR'});
      break;
    }

    if(menuItem) menu.push(menuItem);

    log.info({type: 'MENU_ITEM', item: menuItem.label});

    if( i >= menuLength - 1 ) {
      email(log, menu);
      log.info({type: 'MENU_COMPLETE'});
      res.send(JSON.stringify(menu , null, 2));
    }
  }
}

module.exports = (logger) => {
  log = logger;
  return makeMenu;
};
