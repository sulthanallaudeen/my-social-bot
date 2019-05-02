var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var OneSignal = require('onesignal-node');      


router.get('/', function(req, res, next) {
    res.send({ "success": 1, 'data': req.body });
});
/* Post Tweet */
router.post('/postTweet', function(req, res, next) {
    console.log(req.body)
    var client = new Twitter({
        consumer_key: req.body.consumer_key,
        consumer_secret: req.body.consumer_secret,
        access_token_key: req.body.access_token_key,
        access_token_secret: req.body.access_token_secret
    });

    // var params = { screen_name: 'nodejs' };
    // client.get('statuses/user_timeline', params, function(error, tweets, response) {
    //     if (!error) {
    //         //console.log(tweets);
    //     }
    // });

    client.post('statuses/update', { status: req.body.tweet }, function(error, tweet, response) {
        if (error) {
            res.send({ "success": 0, 'error': error, 'body': req.body });
        } else {
            res.send({ "success": 1, 'tweet': tweet, 'response': response });
        }
    });
});
/* Web Push - One Signal */
router.post('/webPush', function(req, res, next) {
    var myClient = new OneSignal.Client({      
        userAuthKey: req.body.userAuthKey,
        app: { appAuthKey: req.body.appAuthKey, appId: req.body.appId}
    });      
          
    // we need to create a notification to send      
    var firstNotification = new OneSignal.Notification({      
        contents: {      
            en: req.body.message
        }      
    });      
    // set target users      
    firstNotification.postBody["included_segments"] = ["Active Users"];
    firstNotification.postBody["excluded_segments"] = ["Banned Users"];
    // set notification parameters      
    // firstNotification.postBody["data"] = {"abc": "123", "foo": "bar"};      
    //firstNotification.postBody["send_after"] = 'Thu May 02 2019 15:58:00 GMT+0530 (UTC)'; // to send immediate push 
    myClient.sendNotification(firstNotification, function (err, httpResponse,data) {      
       if (err) {
        res.send({ "success": 0, 'error': err });
       } else {
           res.send({ "success": 1, 'data': data, code : httpResponse.statusCode });
       }      
    });
});

module.exports = router;