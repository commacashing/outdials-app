FROM mirror.gcr.io/n8nio/n8n:latest

USER root

WORKDIR /usr/local/lib/node_modules/n8n

RUN npm install exceljs

WORKDIR /

USER node
