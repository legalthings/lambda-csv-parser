LegalThings - AWS Lambda CSV parser
==================

## Requirements

- [Node.js (ES6)](https://nodejs.org) >= 8.1.0


## Installation

The dependencies can be installed using npm.

    npm install


## Testing

Lambda function can be locally simulated for testing.

    npm test


## Example

Currently the Lambda function can only parse CSV data from a URL.

For example we have the following CSV data at `http://example.com/input.csv`.

```csv
name,email
john,john@example.com
jane,jane@example.com
bob ross,bob@example.com
```

Make a `[POST]` request to the Lambda with the following data.

```json
{ "url": "http://example.com/input.csv" }
```

The result is an array of objects based on the CSV data.

```json
[
    { "name": "john", "email": "john@example.com" },
    { "name": "jane", "email": "jane@example.com" },
    { "name": "bob ross", "email": "bob@example.com" }
]
```
