FROM node:16.14.0

WORKDIR /app

RUN groupadd -r cystack && useradd -m -r -g cystack -s /usr/sbin/nologin -c "CyStack user" cystack

RUN npm install pm2 -g

COPY . /app

RUN yarn

ENV NODE_ENV=production

ARG SENTRY_DSN

ENV CS_ENVIRONMENT=staging

ENV BASE_URL=https://old-staging.locker.io

ENV BASE_ID_URL=https://id-staging.locker.io

ENV BASE_API_URL=https://api.cystack.org/v3

ENV WS_URL=wss://api.cystack.org/ws

ENV DESKTOP_WS_URL=ws://localhost:1040

ENV LOGO_URL=https://staging.locker.io/logo/

ENV ENTERPRISE_URL=https://enterprise-staging.locker.io

RUN yarn run build-web

ENV HOST 0.0.0.0

USER cystack

CMD ["yarn", "run", "start-web"]
