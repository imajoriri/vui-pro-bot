var aws = require('aws-sdk');
var docClient = new aws.DynamoDB.DocumentClient({region: 'ap-northeast-1'});

exports.putDynamo = async function(userId, data){
  var item = {
    userId: userId,
    data: data,
  };

  var params = {
    TableName: process.env["tableName"],
    Item: item
  };

  await docClient.put(params, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
}
