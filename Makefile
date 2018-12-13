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
