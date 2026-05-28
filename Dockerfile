FROM mirror.gcr.io/n8nio/n8n:latest

USER root
RUN npm install -g exceljs
RUN cd /usr/local/lib/node_modules/n8n && npm link exceljs
USER node
