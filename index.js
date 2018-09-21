const AWS = require('aws-sdk');
const S3 = new AWS.S3();
var dynamo = new AWS.DynamoDB.DocumentClient();
const rp = require('request-promise');

const LINE = require('@line/bot-sdk');
const channelAccessToken = process.env["channelAccessToken"];

exports.handler = async function(event, context, callback) {
  const LINE_CLIENT = new LINE.Client({channelAccessToken: channelAccessToken});

  let response = { statusCode: 200 };
  // Botに返すメッセージ
  var replyMessage = [];

  try{
    console.log(event);

    // 友達追加された時
    if(event.events[0].type === "follow"){
    }else{

      // メッセージがテキストだった時
      if(event.events[0].message.type === "text"){

        // メッセージの内容
        var requestMsg = event.events[0].message.text;
        if(requestMsg === "1"){
        } else if(requestMsg === "2"){
        } else if(requestMsg === "3"){
        }else{
          // リッチメニューから以外のアクセス
        }

      } else {
        replyMessage.push({ 'type': 'text', 'text': "テキストメッセージを入力してください。" });
      }
    }
  }catch(e){
    replyMessage = [{ 'type': 'text', 'text': "申し訳ございません。エラーが発生しました。" }];
    console.log(e)
  }

  // Botにメッセージをリプライ
  await LINE_CLIENT.replyMessage(event.events[0].replyToken, replyMessage);

  return response;
};

