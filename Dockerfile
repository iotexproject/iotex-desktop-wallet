FROM node:8.11.3

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json /app/

RUN npm install
RUN npm run build-production

# Bundle app source
COPY dist /app/
COPY . /app

EXPOSE 4004
CMD [ "npm", "start" ]
