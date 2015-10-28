/**
 * Created by jordan.cotter on 10/27/2015.
 */

var express = require('express'),
    app = express(),
    aws = require('./config').aws_credentials,//THIS HAS YOUR AWS CREDENTIALS AND WILL HOLD OTHER USEFUL STUFF LIKE PORTS AND OTHER CREDENTIALS
    bodyParser = require('body-parser'),
    path = require('path'),
    multipart = require('./services/multipartFormParser'),
    fileUploadService = require('./services/fileUploadService'),
    GoogleUrl = require('google-url');
    googleUrl = new GoogleUrl({key: 'AIzaSyDwB8vuvGH-2ZS9yIqtbJBJyeO2Em4VgGY'}),
    uuid = require('node-uuid'),
    db = require('./lib/database').connection;


app.use(express.static(path.resolve(__dirname, './public')));
app.use(bodyParser.json());

app.post('/api/upload', function(req, res){
    multipart(req, function(err, result){
        if (err) {
            console.warn('Error in multipart');
            return res.error(err);
        }

        if(result.files){
            //DO ASYNC STUFF ABOVE IF MULTIPLE FILES HANDLER RESPONSES JUST LIKE POSTING IN FIELDBOOK SUCCESS MESSAGES AND SUCH
            //ADD UX STUFF
            var file = result.files[0];
            //return res.json("testing some stuff");
            console.log("...uploading file to cloud");
            fileUploadService.uploadFileToCloud("Videos", file.data, file.filename, function(error, result){
                if(error) return res.json(error);
                googleUrl.shorten(result.url, function(innerErr, shortUrl){
                    if(innerErr) return cb(innerErr);
                    console.log('...saving file to db');
                    var query = "INSERT INTO Videos (Id, Name, Url, ShortUrl) VALUES('"+uuid.v4()+"', '"+result.fileName+"', '"+result.url+"', '"+shortUrl+"')";
                    db.query(query, function(err, result){
                        console.log('done!');
                       if(err){
                           console.warn(query);
                           return res.json("Did not save");
                       }else{
                           return res.json("saved successfully");
                       }
                    });
                });
            });
        }

        else {
            return res.json("No file")

        }


    });
});

app.get('/', function(req, res){
   res.sendfile('./public/index.html');
});

app.listen(8000);
console.log("listening on port 8000");

