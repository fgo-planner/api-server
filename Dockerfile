FROM node:16.10.0

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy local_modules. This must be done before `npm install` because it needs
# to be built during the `postinstall` script.
ADD local_modules ./local_modules

# Install app dependencies. The `--unsafe-perm` option is required in order for
# the `postinstall` script to run when building the Docker image.
RUN npm install --unsafe-perm

# Bundle app source
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]