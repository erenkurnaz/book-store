FROM node:20

WORKDIR /workspace

COPY package.json package-lock.json /workspace/

RUN npm install

COPY . .

RUN npm run build

CMD ["node", "./dist/src/main.js"]
