# QA4MBES
Quality assurance for bathymetry data

# Dependencies
User authentication is provided by CRC Accounts, specifically the staging deployment available at [https://staging.accounts.crcsi.com.au](`https://staging.accounts.crcsi.com.au`). Development requires access to this system.

The development environment makes use of docker / docker-compose.

# Development
The way this is set up, there are X docker containers:

- server
    - QA4 backend web services API
    - NodeJS based
- client
    - Web based user interface
    - VueJS, using the [Quasar framework](https://quasar-framework.org/).
- db
    - TODO: Right now 2 (postgres and dynamo), but this needs to be sorted

## Configuration
The following configuration parameters are required. These are set as environment variables in the client and server config files.

* `QA4L_CRCSI_ACCOUNTS_SECRET`  
    * obtained from crcsi accounts drupal admin interface (view client details)
    * This secret must match the `QA4L_CRCSI_ACCOUNTS_CLIENT_ID` id
* `AWS_AWS_DEFAULT_REGION`, `AWS_ACCESS_KEY`, `AWS_SECRET_ACCESS_KEY`
    * For an AWS account that has access to S3.
    * Local deployments of QA4MB make use of remote S3.  

## Setup
Clone the repository
```
    git clone git@bitbucket.org:crc-si/qa4mbes.git
    cd qa4mbes
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

DynamoDB shell for interrogating /modifying the DynamoDB database:  
    [http://localhost:5433](http://localhost:5433)


## Development notes

Both the NodeJS server and VueJS client are run in development mode which
supports hot reloads. In some cases saved code changes may cause the application
to crash that will require a restart of the docker container.




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
`make run-prod` - runs an environment that is similar to a production deployment.

Note that to access the system as a prod URL, you go to [qa4mbes.vcap.me](qa4mbes.vcap.me).

## Database

General process for modifying the database schema is as follows;    

1. Modify/add entity ( found in `server/src/lib/entity`)
1. Run migration generation command (shown below). This will produce a new
typescript file in `server/src/migration`.
1. Confirm migration script is ok (often require modification for default
values, etc)
1. Run new migration `make migration-run`


The following command will create a database migration script (replace MIGRATION_NAME> param);   

```
    docker-compose -f docker-compose-base.yml -f docker-compose-dev.yml \
        run --rm api bash -c "yarn install && yarn run build && \
        ENVIRONMENT=production typeorm migration:generate -n <MIGRATION_NAME>"
```

### Backup and restore

The following commands will create a backup file in the `../backup` dir.

```
    TODAY=$(date '+%F')
    docker-compose -f docker-compose-base.yml -f docker-compose-dev.yml \
        run --rm db-postgres-admin pg_dump --format custom --blobs --file \
        "/backup/qa4mbes-backup-${TODAY}.psql"
```

To restore (requires `<BACKUP FILE NAME>` is in `../backup` );

*note:* to drop the existing database all current connections must be closed;
recommend stopping all docker containers (`make stop`).

```
    docker-compose -f docker-compose-base.yml -f docker-compose-dev.yml run --rm db-postgres-admin bash -c "
        dropdb postgres ;
        createdb postgres &&
        pg_restore -d postgres '/backup/<BACKUP FILE NAME>'"
```
