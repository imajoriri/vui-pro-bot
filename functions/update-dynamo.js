var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});

exports.updateDynamo= function (userId, data) {

  var params = {
    TableName: process.env["tableName"],
    Key:{
      "userId": userId 
    },
    UpdateExpression: "set beer_count = beer_count + :val",
    // UpdateExpressionで定義した変数を代入
    ExpressionAttributeValues:{
      ":val":1
    },
    ReturnValues:"UPDATED_NEW"
  };

  dynamo.update(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}
