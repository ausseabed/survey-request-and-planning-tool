# node 20 will be maintained through till April 2026
# this image uses debian bookworm, supported through till June 2028
FROM node:20 as builder

# libreoffice is used to convert word documents to pdf (required by
# libreoffice-convert package)
# postgis command line tools (pgsql2shp) are used by the web server
RUN \
    apt-get update \
    && apt-get install -y --no-install-recommends \
        libreoffice \
        postgis

ENV APPDIR=/code
WORKDIR $APPDIR

# We need some build environment variables to switch settings with
ARG AUTH_HOST
ARG AUTH_CLIENT_ID

# And npm bits
ADD package.json yarn.lock .babelrc $APPDIR/
ADD ormconfig.js $APPDIR/ormconfig.js

RUN yarn global add mocha typeorm@0.2.45 @babel/core @babel/cli

ADD src $APPDIR/src
ADD ssh_keys $APPDIR/ssh_keys

# Do the package install and build in one step to reduce size of Docker image
RUN yarn install && yarn run build

# sharp requires this special "--ignore-engines" arg to install correctly
# it would be inappropriate to apply this to all dependencies
RUN yarn add sharp --ignore-engines

CMD bash -c "typeorm migration:run && yarn run start"
