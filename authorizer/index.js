require('dotenv').config();
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.jwtsecret;

const allow = {
  principalId: 'user',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: 'Allow',
        Resource: process.env.RESOURCE
      }
    ]
  }
};

function extractTokenFromUrl(e) {
  if (!e.queryStringParameters && !e.queryStringParameters.authToken) return '';
  return e.queryStringParameters.authToken;
}

function validateToken(token, callback) {
  try {
    const payload = jwt.verify(token, jwt_secret);
    // need to add groups
    if (payload) {
      console.log(JSON.stringify(allow));
      callback(null, allow);
    } else {
      callback('Unauthorized');
    }
  } catch (err) {
    console.log(err);
    callback('Unauthorized');
  }
}

exports.handler = (event, context, callback) => {
  const token = extractTokenFromUrl(event);
  validateToken(token, callback);
};
