FROM node:16

WORKDIR /images

ENV PORT 3000

ENV PORT 2567

COPY package.json /images/package.json

RUN npm install

COPY . /images

RUN npm install --legacy-peer-deps --include=dev

RUN npm run -s build

CMD ["npm", "run", "-s", "start"]