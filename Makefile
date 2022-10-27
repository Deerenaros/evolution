.PHONY: build configure clean run

run: build
	docker-compose up -d

build: configure
	tar -C app -ch . | docker build -t evolution:`jq -r .version < package.json` -

configure:
	npm install
	cp -t app/static/js node_modules/bootstrap/dist/js/bootstrap.bundle.js*
	cp -t app/static/css/ node_modules/bootstrap/dist/css/bootstrap.min.css*

clean:
	rm -rf node_modeles
	rm -f app/static/js/bootstrap.bundle.js*
	rm -f app/static/css/bootstrap.min.css*