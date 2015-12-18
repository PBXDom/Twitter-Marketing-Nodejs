var Twitter = require('twitter');
var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1",
  aws_secret_access_key : "YOUR_SECRET_KEY",
  aws_access_key_id : "YOUR_ACCESS_KEY"
});

var dynamodbDoc = new AWS.DynamoDB.DocumentClient();

var client = new Twitter({
    consumer_key: 'YOUR_consumer_key',
    consumer_secret: 'YOUR_consumer_secret',
    access_token_key: 'YOUR_access_token_key',
    access_token_secret: 'YOUR_access_token_secret',
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
console.log('Start Service');
client.stream('statuses/filter', {
    track: '"Keyword1","Keyword2"'
}, function(stream) {
    stream.on('data', function(tweet) {
        console.log('New Tweet : ',tweet.text)
        if (tweet.user.screen_name != 'pbxdom') {


            //console.log(tweet);
            //Favorite their post
            if (tweet.user.followers_count>20)
            {
                //console.log(tweet);


            // Need add user to database and not send again until 1 week
            // Send Reply
//console.log(tweet);
// console.log('Search User '+tweet.user.screen_name+' in Database');

// var searchparams = {
//     TableName : "twitterfavorite",
//     KeyConditionExpression: "#uname = :username",
//     ExpressionAttributeNames:{
//         "#uname": "name"
//     },
//     ExpressionAttributeValues: {
//         ":username":tweet.user.screen_name
//     }
// };

// dynamodbDoc.query(searchparams, function(err, data) {
//     if (err) {
//         console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
//     } else {
//         if (data.Count===0)
//         {
//             console.log('User not found in db and send reply ');
//             console.log('simulate reply');
//             var userreply=tweet.user.screen_name;
//             client.post('statuses/update', {
//                 status: '@' + tweet.user.screen_name + ' Try Our Service ;) ',
//                 in_reply_to_status_id: tweet.id_str
//             }, function(error, tweet, response) {
//                 if (!error) {
//                     console.log('Send One Tweet OK to ',userreply);
//                     //console.log(tweet);
//                 }
//             });



//         }
//         else
//         {
//             console.log('User '+tweet.user.screen_name+' Found in db and not send reply again');
//         }
//     }
// });


                var params = {
                    TableName:"twitter",
                    Item:{
                        "idstr":tweet.id_str,
                        "name":tweet.user.screen_name,
                        "text":tweet.text,
                        "follower": tweet.user.followers_count,
                        "url":"https://twitter.com/"+tweet.user.screen_name+"/status/"+tweet.id_str,
                        "dtstamp": new Date().getTime(),
                        "language":tweet.user.lang,
                        "timezone":tweet.user.time_zone,
                        "location":tweet.user.location,
                        }
                    };

                dynamodbDoc.put(params, function(err, data) {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    } else {
                       //console.log("Added item:", JSON.stringify(data, null, 2));
                       console.log('Data of user '+tweet.user.screen_name+' Add to database');
                    }
                });


            console.log('Favorite post for user '+tweet.user.screen_name);

            // client.post('favorites/create', {
            //     id: tweet.id_str
            // }, function(error, response) {
            //     console.log('favorite post user '+tweet.user.screen_name+' with '+tweet.user.followers_count+' followers');

            // });

            }
            else
           {
              console.log('bypass fake user '+tweet.user.screen_name+' with '+tweet.user.followers_count);
            }
        }


    });

    stream.on('error', function(error) {
        console.log(error);
    });
});
