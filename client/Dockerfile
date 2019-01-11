FROM node:8.14.0 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG AUTH_HOST

RUN echo $API_HOST

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# install vue and quasar command line interface
RUN yarn global add vue-cli quasar-cli

# And npm bits
ADD package.json yarn.lock .babelrc .postcssrc.js quasar.conf.js $APPDIR/
ADD src $APPDIR/src
ADD .quasar $APPDIR/.quasar

RUN yarn && yarn run build

FROM nginx:1.13.9 as nginx

# Set up Nginx
ADD build/nginx-www.conf /etc/nginx/nginx.conf
ADD build/nginx-www-default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /code/dist/spa-mat /tmp/dist/spa-mat
RUN rm -rf /usr/share/nginx/html && mv /tmp/dist/spa-mat /usr/share/nginx/html
