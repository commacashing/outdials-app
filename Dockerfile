FROM mirror.gcr.io/n8nio/n8n:latest

USER root

WORKDIR /tmp/npm-build

RUN npm install --omit=dev exceljs

RUN cp -rn /tmp/npm-build/node_modules/* /usr/local/lib/node_modules/n8n/node_modules/ || true

RUN rm -rf /tmp/npm-build

WORKDIR /home/node

USER node
