require('dotenv').config();
const keys = require('./keys');
const Spotify = require('node-spotify-api');
const Twitter = require('twitter');
var request = require("request");
const fs = require('fs');

const spotify1 = new Spotify(keys.spotify);
const twitter1 = new Twitter(keys.twitter);

const command = process.argv[2];
// const detail = process.argv[3];
var detail = process.argv.splice(3).join(" ");

console.log(`Starting ${command}\n`)
switch (command) {
    case 'my-tweets':
        getMyTweets()
        break;
    case 'spotify-this-song':
        getSpotify()
        break;
    case 'movie-this':
        getMovie()
        break;
    case 'do-what-it-says':
        doRandom();
        break;
    default:
        console.log('Please use a correct command!')
}

function getMyTweets() {
    var params = {
        screen_name: 'racheal_annette',
        count: 20

    };
    twitter1.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@racheal_annette: " + tweets[i].text + " Created At: " + date.substring(0, 19));

                console.log("-----------------------");
            }

        }
    });
}

function getSpotify() {
    if (detail.length < 1) {
        detail = "the sign ace of base"
    }
    spotify1.search({ type: 'track', query: detail }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;

        }
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song Title: " + data.tracks.items[0].name)
        console.log("Preview URL: " + data.tracks.items[0].preview_url)
        console.log("Album: " + data.tracks.items[0].album.name)
    });
}

// else if (input1 === "movie-this") 
function getMovie() {
    if (detail.length < 1) {

        detail = "Mr. Nobody";
    };



    var queryUrl = "http://www.omdbapi.com/?t=" + detail + "&y=&plot=short&tomatoes=true&apikey=trilogy";


    request(queryUrl, function (error, response, body) {


        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);


            // * Title of the movie.
            console.log("Title: " + data.Title)
            // * Year the movie came out.
            console.log("Year: " + data.Year)
            // * IMDB Rating of the movie.
            console.log("IMDB Rating: " + data.imdbRating)
            // * Rotten Tomatoes Rating of the movie.
            var rating =data.Ratings[1] ? data.Ratings[1].Value : "N/A"
            console.log("Rotten Tomatoes: " + rating)
            // * Country where the movie was produced.
            console.log("Country Produced: " + data.Country)
            // * Language of the movie.
            console.log("Language: " + data.Language)
            // * Plot of the movie.
            console.log("Plot: " + data.Plot)
            // * Actors in the movie.
            console.log("Actors: " + data.Actors)

        }
    });
}

function doRandom() {
    fs.readFile("./random.txt", "utf-8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log(data);

    });
}