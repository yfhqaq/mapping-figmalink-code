FROM node:16.20.0-alpine3.17

ARG NODE_ENV=production
ARG FRONT_ARTIFACT_DIR=./storybook-static
ARG SERVER_DIR=./server
ARG VIEWS_DIR=./views

WORKDIR /app

COPY ${SERVER_DIR}/package.json ${SERVER_DIR}/auth.js ${SERVER_DIR}/index.js ./
COPY ${FRONT_ARTIFACT_DIR} ./storybook-static

RUN npm install --registry https://registry.npmmirror.com/

RUN mkdir views && \
    mv ./storybook-static/index.html ./views/index.html && \
    mv ./storybook-static/iframe.html ./views/iframe.html

EXPOSE 6005

CMD ["node", "index.js"]
