# QA4MBES
Quality assurance for bathymetry data

# Dependencies
User authentication is provided by CRC Accounts, specifically the staging deployment available at [https://staging.accounts.crcsi.com.au](`https://staging.accounts.crcsi.com.au`). Development requires access to this system.

# Development
The way this is set up, there are X docker containers:

 * The api

## Development commands
There are a variety of mainenance commands available, all accessed via make:

`make run` - runs the development environment  
`make build-dev` - runs docker compose build for development environment  
`make stop` - stops all containers  
`make clean` - removes `node_modules` from server  
