FROM node:11.6.0 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG AUTH_HOST
ARG AUTH_CLIENT_ID

# And npm bits
ADD package.json yarn.lock .babelrc ormconfig-prod.js $APPDIR/

RUN yarn global add mocha typeorm @babel/core @babel/cli

ADD src $APPDIR/src

# Do the package install and build in one step to reduce size of Docker image
RUN yarn install && yarn run build

CMD yarn run start
