DEV=-f docker-compose-base.yml -f docker-compose-dev.yml

# Running things
run:
	docker-compose $(DEV) up www

# Building things
build-dev:
	docker-compose $(DEV) build

stop:
	docker-compose $(DEV) stop

clean:
	rm -rf server/node_modules
	rm -rf client/node_modules

# database management targets, operate on Postgres
delete-tables:
	docker-compose $(DEV) run api bash -c "yarn install && npm run build && typeorm schema:drop --config ormconfig-prod"

migration-run:
	docker-compose $(DEV) run api bash -c "yarn install && npm run build && typeorm migration:run --config ormconfig-prod"

migration-revert:
	docker-compose $(DEV) run api bash -c "yarn install && npm run build && typeorm migration:revert --config ormconfig-prod"

test:
	docker-compose $(DEV) run api-test
