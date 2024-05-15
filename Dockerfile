FROM node:20.13.1

# Create app directory
WORKDIR usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

RUN npx prisma generate --schema=./prisma/schema.prisma

EXPOSE 3000

CMD [ "./init.sh"]