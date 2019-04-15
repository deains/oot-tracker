all: optimize

clean:
	@rm -rf dist

jslib: src/js/lib/json.js src/js/lib/require.js src/js/lib/text.js

npm:
	@npm install

optimize: npm jslib
	@./node_modules/.bin/r.js -o build.js
	@./node_modules/.bin/postcss -r --no-map dist/css --use autoprefixer

publish: optimize
	@./node_modules/.bin/gh-pages -d dist

zip: optimize
	@cd dist && zip -mr oot-tracker .

src/js/lib/json.js: npm
	@cp node_modules/requirejs-json/json.js src/js/lib/json.js

src/js/lib/require.js: npm
	@cp node_modules/requirejs/require.js src/js/lib/require.js

src/js/lib/text.js: npm
	@cp node_modules/text/text.js src/js/lib/text.js

.PHONY: all clean jslib npm optimize publish zip
