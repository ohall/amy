/**
 * Created by Oakley Hall on 3/3/17.
 */

const _ = require('lodash');
const moment = require('moment');
const nodemailer = require('nodemailer');
const fs = require('fs');

const subject = `Menu for ${moment().format('M/D/Y')}`;

const printMenuItem = item => {
  const { label, url, ingredientLines } = item;
  return `<p>${label}</p><a href="${url}">${url}</a><ul>${_.map(ingredientLines, ingr => `<li>${ingr}</li>`).join('')}</ul><br/>`;
};

const printMenu = menu =>
  `<h3>${subject}</h3><a href="https://www.edamam.com/">www.edamam.com</a><br><br>${_.map(menu, printMenuItem).join('')}`;


const email = (error, menu) => {

  const { EMAIL, AUTH, FROM, TO } = process.env;

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: EMAIL, pass:  AUTH }
  });

  const html = printMenu(menu);

  let mailoptions = { subject, html, from: FROM, to: TO };

  fs.writeFileSync('html.html', printMenu(menu));

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