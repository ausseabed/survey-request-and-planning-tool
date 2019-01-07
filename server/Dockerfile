FROM node:11.6.0 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG API_HOST
ARG WEB_HOST
ARG AUTH_HOST
ARG AUTH_CLIENT_ID

RUN echo $API_HOST

# Set up the files to build with
#ADD build $APPDIR/build
#ADD static $APPDIR/static
#ADD .eslintrc.js $APPDIR/

# Add in the project files
#ADD client $APPDIR/client

# And npm bits
ADD package.json $APPDIR/
ADD yarn.lock $APPDIR/

EXPOSE 3000
# NodeJS inspect port for remote debugging
EXPOSE 9229

RUN yarn global add @babel/core
RUN yarn global add @babel/cli

RUN yarn global add mocha
RUN yarn global add typeorm

# Do the package install and build in one step to reduce size of Docker image
RUN yarn install
#RUN yarn build
