/**
 * Created by Oakley Hall on 3/3/17.
 */

const _ = require('lodash');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require('fs');

const title = 'Menu for ' + moment().format('M/D/Y');

const printMenu = menu => {
  return '<h3>'+title+'</h3><a href="https://www.edamam.com/">www.edamam.com</a><br><br> ' +
    _.map(menu, item => {
      return'<b>'+item.day+'</b>' +
        '<p>'+item.name+'</p>' +
        '<a href="'+item.url+'">'+item.url+'</a>' +
        '<ul>' + _.map(item.ingredients, ingr => '<li>'+ingr+'</li>').join('') + '</ul>';
    }).join('<br>') ;
};

const email = (error, menu) => {

  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: process.env.EMAIL, pass:  process.env.AUTH}});

  let mailoptions = {
    from: process.env.FROM,
    to: process.env.TO,
    subject: title,
    html: printMenu(menu)
  };

  fs.writeFileSync('html.html', JSON.stringify( printMenu(menu), null, 2) )

  transporter.sendMail(mailoptions, (err, info) => {
    if (err) {
      error(err);
      return;
    }
    console.log('Message sent successfully!');
    console.log('Server responded with "%s"', info.response);
    transporter.close();
  });

};

module.exports = email;