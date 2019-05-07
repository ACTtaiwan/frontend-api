FROM node:8.11.3

# Create app directory
RUN mkdir /opt/app
WORKDIR /opt/app

# Install app dependencies
COPY ./package*.json ./
COPY ./tsconfig.json ./

# dependency
COPY ./.env ./

RUN npm set strict-ssl false
RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY ./config ./config
COPY ./functions ./functions

EXPOSE 4000
CMD [ "npm", "start" ]