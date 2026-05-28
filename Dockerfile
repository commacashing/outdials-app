FROM mirror.gcr.io/n8nio/n8n:latest

USER root

RUN npm install -g exceljs

USER node
