DEV=-f docker-compose-base.yml -f docker-compose-dev.yml
PROD=-f docker-compose-base.yml -f docker-compose-prod.yml

# Running things
run:
	docker-compose $(DEV) up www api

run-prod:
	docker-compose $(PROD) up

# Building things
build-dev:
	docker-compose $(DEV) build

build-prod:
	docker-compose $(PROD) build

stop:
	docker-compose $(DEV) stop

clean:
	rm -rf server/node_modules
	rm -rf client/node_modules

rm-prod:
	docker-compose $(PROD) rm --force

# database management targets, operate on Postgres
delete-tables:
	docker-compose $(DEV) run --rm api bash -c "yarn install && rm -rf ./dist && yarn run build && ENVIRONMENT=production typeorm schema:drop"

migration-run:
	docker-compose $(DEV) run --rm api bash -c "yarn install && rm -rf ./dist && yarn run build && ENVIRONMENT=production typeorm migration:run"

migration-revert:
	docker-compose $(DEV) run --rm api bash -c "yarn install && rm -rf ./dist && yarn run build && ENVIRONMENT=production typeorm migration:revert"

test:
	docker-compose $(DEV) run api-test
