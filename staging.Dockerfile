FROM node:16.10.0

WORKDIR /app

RUN groupadd -r cystack && useradd -m -r -g cystack -s /usr/sbin/nologin -c "CyStack user" cystack

RUN npm install pm2 -g

COPY . /app

RUN yarn

ENV NODE_ENV=production

ENV SENTRY_DSN=https://953169f6dd2947cfbab029caf5810d94@o256038.ingest.sentry.io/6626150

ENV CS_ENVIRONMENT=staging

ENV BASE_URL=https://staging.locker.io

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
