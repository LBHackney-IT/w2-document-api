.PHONY: setup
setup:
	npm i && pushd api && npm install && popd && pushd authorizer && npm install && popd

.PHONY: test
test: 
	pushd api && npm run test-coverage && popd

.PHONY: lint
lint:
	./node_modules/.bin/eslint .
