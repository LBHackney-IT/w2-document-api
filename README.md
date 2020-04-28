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

W2 Documents API provides a way to view and/or download documents from Hackney systems.
It currently fetches UHW and COMINO documents from W2 Image Server.

Images get cached in S3?

Currently supports msg, pdf, xml, rtf?? formats.

## Installation

1\. Run the following in the root directory to install dependencies:

```
$ make setup
```

2\. Add a .env file in the root directory (see .env.sample for file structure).

## Run the API

```
$ npm run start
```

## Run tests locally

Run the following in the root directory

```
$ make test
```

## Usage

### View Email Attachements:

- Route: `/attachments/:imageId/view`
- Method: `GET`
- imageId=`[string]`

### Download Email Attachements:

- Route: `/attachments/:imageId/download`
- Method: `GET`
- imageId=`[string]`

### Get all Documents Metadata for Customer:

- Route: `/customers/:id/documents`
- Method: `GET`
- id=`[string]`

### Get a Document Metadata:

- Route: `/documents/:id`
- Method: `GET`
- id=`[string]`

### View a Document:

- Route: `/documents/:id/view`
- Method: `GET`
- id=`[string]`

### Download a Document:

- Route: `/documents/:id/download`
- Method: `GET`
- id=`[string]`

## Debug the API (VS Code)

Create a new file at .vscode/launch.json and add the following:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "name": "Serverless Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "debug"],
      "port": 9229
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest",
      "cwd": "${workspaceFolder}",
      "program": "${workspaceFolder}/api/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "disableOptimisticBPs": true,
      "windows": {
        "program": "${workspaceFolder}/node_modules/jest/bin/jest"
      }
    }
  ]
}
```

## Linting

Run the following in the root directory

```
$ make lint
```

## Prettier

We recommend installing the Prettier extension in your editor to keep formatting consistent.
