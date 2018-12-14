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

## Setup
Clone the repository
```
    git clone git@bitbucket.org:crc-si/qa4mbes.git
    cd qa4mbes
```

Copy/edit configs. The following environment variables need to be set:
- `server.conf`
  - `QA4L_CRCSI_ACCOUNTS_SECRET` - obtained from crcsi accounts drupal admin interface (view client details)

```
    cp -r config.sample ../config
    vi ../config/server.conf
```

Build and run  
```
    make run
```

## Development notes

TODO: Hot reloads, etc


## Development commands
There are a variety of mainenance commands available, all accessed via make:

`make run` - runs the development environment  
`make build-dev` - runs docker compose build for development environment  
`make stop` - stops all containers  
`make clean` - removes `node_modules` from server  
