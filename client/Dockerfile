# When run in dev mode only the first stage of this docker file is utilised.
# In prod mode the first stage builds the quasar app and copies the dist
# artifacts into the nginx container where it's hosted as simple static 
# files.
#
# The nginx container is quite up to date, but the node:12 image is now somewhat
# dated. SCT uses quasar v1 (VueJS 2) and migrating to a newer version of nodeJS
# is not possible withough upgrading to quasar v2 (VueJS 3), which is a significant
# undertaking.

FROM node:20 as builder

ENV APPDIR=/code
WORKDIR $APPDIR

RUN echo $API_HOST

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

# install quasar command line interface
RUN npm install -g @quasar/cli@2.4.0

# And npm bits
ADD package.json package-lock.json babel.config.js .postcssrc.js quasar.conf.js $APPDIR/
ADD src $APPDIR/src

RUN whoami

RUN mkdir /code/node_modules
RUN chown node:node /code/node_modules -R

RUN ls -al /code/node_modules

RUN npm install && npm run build

FROM nginx:1.25.4 as nginx

# Set up Nginx
ADD build/nginx-www.conf /etc/nginx/nginx.conf
ADD build/nginx-www-default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /code/dist/spa /tmp/dist/spa
RUN rm -rf /usr/share/nginx/html && mv /tmp/dist/spa /usr/share/nginx/html
