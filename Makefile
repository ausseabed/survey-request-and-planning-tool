DEV=-f docker-compose-base.yml -f docker-compose-dev.yml

# Running things
run:
	docker-compose $(DEV) up

# Building things
build-dev:
	docker-compose $(DEV) build

stop:
	docker-compose $(DEV) stop

clean:
	rm -rf server/node_modules

# database management targets, operate on DynamoDB
create-tables:
	docker-compose $(DEV) run api bash -c "yarn install && npm run create-tables"

delete-tables:
	docker-compose $(DEV) run api bash -c "yarn install && npm run delete-tables"
