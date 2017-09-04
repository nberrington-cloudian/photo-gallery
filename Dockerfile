FROM node:boron

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install

# Bundle app source
COPY . .

# Get binary for our go server
COPY golang-object-store-service .

COPY demo-start.sh .

EXPOSE 3000 8888

CMD [ "./demo-start.sh" ]
