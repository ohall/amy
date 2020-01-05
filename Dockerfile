FROM node:13.5.0

# Create app directory
WORKDIR /amy

COPY . .

RUN npm install pm2 -g

RUN npm install

EXPOSE 3000

CMD [ "pm2-runtime", "index.js", "--name", "amy" ]
