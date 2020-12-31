# amy
Make grocery lists for Amy

Uses Edamam API to generate and email menu and shopping list https://developer.edamam.com/


USAGE:

Start the express server with environment variables.
Get Edmaman ID and KEY from https://developer.edamam.com/
```
FROM="<from email>" TO=<"to email>" EMAIL="<sender gmail username>" AUTH="<sender gmail password>" EDAMAM_ID="<api app id>" EDAMAM_KEY="<api auth>" ./node_modules/.bin/nodemon index.js

```

In another terminal, call the `makeMenu` endpoint

```
curl localhost:3000/makeMenu  
```

Note that timeout set in `config.json` will delay calls to Edamam so as not to run a foul of the request limit.

After a period of time, the email address you set as TO should receive an email with your menus 

