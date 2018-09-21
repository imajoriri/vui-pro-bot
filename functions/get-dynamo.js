'use strict';

var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});

exports.getDynamo = async function (userId) {
  var params = {
    TableName: process.env["tableName"],
    Key: {
      'userId': userId
    }
  };

  return await docClient.get(params).promise();
}; 
