FROM node:11.6.0 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG AUTH_HOST
ARG AUTH_CLIENT_ID

# And npm bits
ADD package.json yarn.lock .babelrc $APPDIR/
ADD ormconfig-prod.js $APPDIR/ormconfig.js 

RUN yarn global add mocha typeorm @babel/core @babel/cli

ADD src $APPDIR/src
ADD config $APPDIR/config
ADD ssh_keys $APPDIR/ssh_keys

# Do the package install and build in one step to reduce size of Docker image
RUN yarn install && yarn run build

CMD bash -c "typeorm migration:run && yarn run start"
