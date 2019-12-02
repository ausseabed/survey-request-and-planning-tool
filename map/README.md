# MapServer Configuration

MapServer layers are configured in `mapserver.map.tmpl`; this includes references to database tables and columns that are defined in the `/server/src/lib/entity` folder. Changes to table and column names must be reflected in this config file.

When run the MapServer docker image automatically converts the `mapserver.map.tmpl` to `mapserver.map` substituting in environment variables. The parameters can been seen in the `.tmpl` using the following syntax `"user={{ getenv "MY_ENV_VAR" }}`.

The base docker-compose file specifies the env vars that are passed into the docker image (they come from `server.conf`).
