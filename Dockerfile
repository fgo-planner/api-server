FROM node:14.10.0

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]