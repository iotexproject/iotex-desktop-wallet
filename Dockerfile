FROM node:10.18.0

WORKDIR /app
COPY . /app/

RUN npm install
RUN npm run build-production

EXPOSE 4004
CMD [ "npm", "start" ]
