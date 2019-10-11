FROM node:12 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG AUTH_HOST
ARG AUTH_CLIENT_ID

RUN echo $API_HOST

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# install quasar command line interface
RUN npm install -g @quasar/cli

# And npm bits
ADD package.json package-lock.json babel.config.js .postcssrc.js quasar.conf.js $APPDIR/
ADD src $APPDIR/src

RUN whoami

RUN mkdir /code/node_modules

RUN ls -al /code/node_modules

RUN yarn install && yarn run build

FROM nginx:1.13.9 as nginx

# Set up Nginx
ADD build/nginx-www.conf /etc/nginx/nginx.conf
ADD build/nginx-www-default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /code/dist/spa /tmp/dist/spa
RUN rm -rf /usr/share/nginx/html && mv /tmp/dist/spa /usr/share/nginx/html
