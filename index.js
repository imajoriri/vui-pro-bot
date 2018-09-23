const AWS = require('aws-sdk');
const S3 = new AWS.S3();
var dynamo = new AWS.DynamoDB.DocumentClient();
//const rp = require('request-promise');

const LINE = require('@line/bot-sdk');
const channelAccessToken = process.env["channelAccessToken"];

// functions
const { putDynamo } = require('./functions/put-dynamo.js');
const { getDynamo } = require('./functions/get-dynamo.js');
const { updateDynamo } = require('./functions/update-dynamo.js');

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
        const userId = event.events[0].source.userId;

        var dynamoData = await getDynamo(userId);
        console.log(dynamoData);

        // 会話入力の開始
        if(requestMsg === "start"){
          const putData = {
            require: true,
            count: 0,
            speech: [],
          }
          putDynamo(userId, putData);
          replyMessage.push({ 'type': 'text', 'text': "スキル起動時にClovaに喋らせたい最初の会話を入力してください" });
        } 

        // TODO 終了する
        else if(requestMsg === "finish"){
          const putData = {
            //require: false,
            //count: 0,
            //speech: [],
          }
          putDynamo(userId, putData);
          replyMessage.push({ 'type': 'text', 'text': "会話をリセットしました。" });
        }

        // 入力モードで発話を入力された時
        else{
          // startしてない場合は終了
          if(dynamoData.Item.data.require === false){
            replyMessage.push({ 'type': 'text', 'text': "リッチメニューよりstartしてください。" });
          }
          // startしている場合、dynamoに入れていく
          else{
            // メッセージを保存
            const next = dynamoData.Item.data.count + 1;
            var putData = dynamoData.Item.data;
            putData.speech.push(requestMsg);
            //putData[String(next)] = requestMsg;
            putData.count = next;
            putDynamo(userId, putData);

            replyMessage.push({ 'type': 'text', 'text': `${next}回目の発話は、「${requestMsg}」です。${next + 1}回目に発話させたい内容があれば入力してください。` });
          }
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

