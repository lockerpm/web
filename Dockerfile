FROM node:16.0.0

WORKDIR /app

RUN groupadd -r cystack && useradd -m -r -g cystack -s /usr/sbin/nologin -c "CyStack user" cystack

RUN npm install pm2 -g

COPY . /app

RUN yarn

ENV NODE_ENV=production

ENV SENTRY_DSN=https://953169f6dd2947cfbab029caf5810d94@o256038.ingest.sentry.io/6626150

ENV BASE_URL=https://locker.io

ENV BASE_ID_URL=https://id.locker.io

ENV BASE_API_URL=https://api.locker.io/v3

ENV WS_URL=wss://api.locker.io/ws

ENV LOGO_URL=https://locker.io/logo/

ENV ENTERPRISE_URL=https://enterprise.locker.io

ENV STRIPE_PAYMENT_LINK=https://buy.stripe.com/cN26s3gbefi1c92fYZ?prefilled_promo_code=LKPERSONAL50

RUN yarn run build-web

ENV HOST 0.0.0.0

USER cystack

CMD ["yarn", "run", "start-web"]
