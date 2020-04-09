# W2 Documents API

## Table of Contents

- [Documentation](#documentation)
- [Dependencies](#dependencies)
- [Development environment](#development-environment)

## Documentation
The W2 Documents API consits of 3 node projects:
- The `/API` that handles the connection to W2 server and converts documents. 
- `/authorizer`
- The root project handles deployment using [serverless](https://serverless.com/).

## Development environment

1. Copy `.env.example` to `.env` and fill in the secrets
2. Run `make setup`
3. Run `make test` to run all the tests
4. Run `make lint` to run the linter

See `Makefile` for the steps involved in building and running the app.



