FROM mirror.gcr.io/n8nio/n8n:latest

USER root

# Force rebuild by adding timestamp
RUN echo "Build: $(date)" > /tmp/build.txt

RUN npm install -g exceljs

USER node
