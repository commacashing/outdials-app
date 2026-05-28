FROM mirror.gcr.io/n8nio/n8n:latest

USER root

RUN cd /usr/local/lib/node_modules/n8n && \
    rm -rf node_modules pnpm-lock.yaml && \
    pnpm install && \
    pnpm add exceljs

USER node
