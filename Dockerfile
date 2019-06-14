FROM node:10
MAINTAINER Dan Goje <gojdan98@gmail.com>

# Copy code.
ADD . /opt/server
WORKDIR /opt/server

# Install dependencies and build app.
RUN npm install
RUN npm run build

# Remove unecessary files.
RUN rm -rf src node_modules

# Instal dependencies.
RUN npm ci --only=production

# Export port.
EXPOSE 3000

# Start application.
CMD [ "npm", "start" ]