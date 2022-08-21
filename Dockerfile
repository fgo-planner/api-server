FROM node:16.10.0

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy .npmrc
COPY .npmrc ./

# Install app dependencies.
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
