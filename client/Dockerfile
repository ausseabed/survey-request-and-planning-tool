FROM node:8.14.0 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG API_HOST
ARG WEB_HOST
ARG AUTH_HOST
ARG AUTH_CLIENT_ID

RUN echo $API_HOST

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# Set up the files to build with
#ADD build $APPDIR/build
#ADD static $APPDIR/static
#ADD .eslintrc.js $APPDIR/

# Add in the project files
#ADD client $APPDIR/client

# And npm bits
ADD package.json $APPDIR/
ADD yarn.lock $APPDIR/

EXPOSE 3001

# install vue and quasar command line interface
RUN yarn global add vue-cli
RUN yarn global add quasar-cli

RUN yarn install
