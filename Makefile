.PHONY: build configure clean run

run: build
	docker-compose up -d

build: configure
	cp -t app/static/js node_modules/bootstrap/dist/js/bootstrap.bundle.js* node_modules/jquery/dist/jquery.min.js*
	cp -t app/static/css/ node_modules/bootstrap/dist/css/bootstrap.min.css*
	cp -rt app/static/css/ node_modules/bootstrap-icons/font/fonts node_modules/bootstrap-icons/font/bootstrap-icons.css
	tar -C app -ch . | docker build -t evolution:`jq -r .version < package.json` -
	rm -rf app/static/css/fonts app/static/css/bootstrap-icons.css
	rm -f app/static/js/bootstrap.bundle.js* app/static/js/jquery.min.js*
	rm -f app/static/css/bootstrap.min.css*

configure:
	npm install

clean:
	rm -rf node_modeles