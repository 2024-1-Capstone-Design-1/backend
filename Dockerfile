FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001

COPY wait-for-it.sh /usr/local/bin/wait-for-it.sh

RUN chmod +x /usr/local/bin/wait-for-it.sh

CMD ["/bin/sh", "/usr/local/bin/wait-for-it.sh", "postgres", "5432", "--", "node", "src/server.js"]