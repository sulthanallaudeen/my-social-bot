var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

/* GET home page. */
router.post('/', function(req, res, next) {
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
            res.send({ "success": 0, 'error': error });
        } else {
            res.send({ "success": 1, 'tweet': tweet, 'response': response });
        }
    });

    res.render('index', { title: 'Express' });
});

module.exports = router;