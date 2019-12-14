FROM node:10.17.0

WORKDIR /app
COPY . /app/

RUN npm install
RUN npm run build-production

EXPOSE 4004
CMD [ "npm", "start" ]
