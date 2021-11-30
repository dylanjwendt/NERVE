FROM node:17

WORKDIR /images

ENV PORT 80

COPY package.json /images/package.json

RUN npm install

COPY . /images

RUN npm install --legacy-peer-deps --include=dev

RUN npm run -s clean

RUN npm run -s build

CMD "npm run -s start"