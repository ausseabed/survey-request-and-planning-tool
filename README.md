# AusSeabed - Request and Planning Tool
Web based application to support the request and planning of bathymetric surveys.

# Build status
[![CircleCI](https://circleci.com/gh/frontiersi/asb-request-and-planning-tool.svg?style=svg&circle-token=cef4f50d53e7216004c240420e035eea4a4a389e)](https://circleci.com/gh/frontiersi/asb-request-and-planning-tool)

# Dependencies
User authentication is provided by CRC Accounts, specifically the staging deployment available at [https://staging.accounts.crcsi.com.au](`https://staging.accounts.crcsi.com.au`). Development requires access to this system.

The development environment makes use of docker / docker-compose.

# Docker container architecture
There are 3 docker containers:

- api
    - Backend server
    - QA4 backend web services API
    - NodeJS based
- www
    - Web based user interface
    - VueJS, using the [Quasar framework](https://quasar-framework.org/).
- db-postgres
    - PostgreSQL database with PostGIS extension

# Development

## Configuration
The following configuration parameters are required. These are set as environment variables in the client and server config files.

* `AUTH_CLIENT_SECRET`  
    * obtained from crcsi accounts drupal admin interface (view client details)
    * This secret must match the `AUTH_CLIENT_ID` id
* `AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
    * For an AWS account that has access to S3.
    * Local deployments of QA4MB make use of remote S3.  

## Setup
Clone the repository
```
    git clone git@github.com:frontiersi/asb-request-and-planning-tool.git
    cd asb-request-and-planning-tool
```

Copy/edit configs. The following environment variables need to be set:  

```
    cp config.sample/server.conf ./server.conf
```

Create database tables. The migrations scripts are also responsible for seeding
default values into the database (eg; instrument types, data capture types, etc)
```
    make migration-run
```

Build and run. This will build and start the various QA4MB containers, docker
compose is run in attached mode.
```
    make run
```

## Debugging

In development deployments NodeJS is run with the `--inspect` flag supporting
remote debugging (remote as the server is run within a docker container).
Several tools support NodeJS remote debugging; chrome included via [chrome://inspect](chrome://inspect). *note:* ignore the targets listed under Remote Targets and instead choose "Open dedicated DevTools for Node".


## Testing
Unit tests are available for the NodeJS server, they can be run via the
following command. Unit tests are run against test databases and do not impact
the production/development databases.

```
    make test
```


## URLs

Web UI application can be found at:  
    [http://localhost:3001](http://localhost:3001)

NodeJS express can be found at:  
    [http://localhost:3000](http://localhost:3000)


## Development notes

Both the NodeJS server and VueJS client are run in development mode which
supports hot reloads. Running database migration scripts may cause the NodeJS
server to crash requiring a restart of the docker container.


## Development commands
There are a variety of maintenance commands available, all accessed via make:

`make run` - runs the development environment  
`make build-dev` - runs docker compose build for development environment  
`make stop` - stops all containers  
`make clean` - removes `node_modules` from client and server  
`make migration-run` - runs the database migration scripts  
`make migration-revert` - reverts the last database migration step (not all)  

## Testing production
Production Docker Compose commands are as follows:

`make build-prod` - builds production ready containers  
`make run-prod` - runs an environment that is similar to a production   deployment.


## Database

General process for modifying the database schema is as follows;    

1. Modify/add entity ( found in `server/src/lib/entity`)
2. Run migration generation command (shown below). This will produce a new
typescript file in `server/src/migration`.
3. Confirm migration script is ok (often require modification for default
values, etc)
4. Run new migration `make migration-run`


The following command will automatically generate a database migration script including schema changes made to the entities (replace MIGRATION_NAME> param);   

```
    docker-compose -f docker-compose-base.yml -f docker-compose-dev.yml \
        run --rm api bash -c "yarn install && rm -rf ./dist && yarn run build && \
        ENVIRONMENT=production typeorm migration:generate -n <MIGRATION_NAME>"
```

A blank new migration can be created by replacing `generate` with `create` in the above command line.


### Backup and restore

The following commands will create a backup file in the `./backup` dir. The docker-compose command will require the db password.

```
    TODAY=$(date '+%F')
    docker-compose -f docker-compose-base.yml -f docker-compose-dev.yml \
        run -e PGDATABASE=postgres -e PGHOST=db-postgres -e PGUSER=postgres \
        --rm db-postgres pg_dump  --format custom --blobs \
        --file "/backup/qa4mbes-backup-${TODAY}.psql"
```

To restore (requires `<BACKUP FILE NAME>` is in `./backup` );

*note:* to drop the existing database all current connections must be closed;
recommend stopping all docker containers (`make stop`).

```
    docker-compose -f docker-compose-base.yml -f docker-compose-dev.yml \
        run -e PGDATABASE=postgres -e PGHOST=db-postgres -e PGUSER=postgres \
        --rm db-postgres bash -c "
            dropdb postgres ;
            createdb postgres &&
            pg_restore -d postgres '/backup/<BACKUP FILE NAME>'"
```
