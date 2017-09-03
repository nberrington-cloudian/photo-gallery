var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var path = require("path");
var static = require('serve-static');
var aws = require('aws-sdk');
var fs = require('fs');
const util = require('./util.js');
var http = require('http');
var request = require('request');

var options = {
  title: 'Demo Photo Gallery',
  thumbnail: false,
  bucket: "/tmp/photos",
  region: "us-west-1",
  s3Type: "aws", //"gfs" for gluster
  clusterIP: null,
};

// Valid options.buckets
// local : "/tmp/photos/"
// AWS S3: bucket: zac-demo-bucket1,  s3Type: "aws",Region: "us-west-1"
// Gluster: *** REQUIRES MICROSERVICES RUNNING **** bucket: bucket-demo-1, s3Type: "gfs", clusterIP: "12.34.56.78:12345"


// Go thru our expected environment values to see if they are set
var envStorageBucket1 = process.env.BUCKET_NAME;  //required
var envS3Type = process.env.OBJECT_STORAGE_S3_TYPE; //required
var envStorageRegion = process.env.OBJECT_STORAGE_REGION;  //only required for AWS
var envClusterIP = process.env.BUCKET_ENDPOINT; //only for displaying what microservices use

if (envStorageRegion) {
    options.region = envStorageRegion;
}
if (envS3Type) {
    options.s3Type = envS3Type;
}
if (envClusterIP) {
    if (options.s3Type == "gfs") {
      options.clusterIP = new Buffer(envClusterIP, 'base64').toString("ascii");
    }
    else {
      options.clusterIP = envClusterIP;
    }
}
if (envStorageBucket1) {
  if (options.s3Type == "gfs") {
    options.bucket = new Buffer(envStorageBucket1, 'base64').toString("ascii");
  }
  else {
    options.bucket = envStorageBucket1;
  }
}


app.use(express.static(__dirname + '/public'));

//app.use('/photos', Gallery(options.bucket, options));
app.use('/photos', require(__dirname + '/index.js')(options.bucket, options));


app.use(fileUpload());

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
app.get('/new',function(req,res){
  res.sendFile(path.join(__dirname+'/upload.html'));
});

app.get("/getvar", function(req, res){
    res.json(options);
});

app.post('/upload', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
 // console.log("File", req.files.sampleFile);
  if (!util.isObjectStore(options)) {
    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(util.buildS3url(options) + req.files.sampleFile.name, function(err) {
      if (err)
        return res.status(500).send(err);
    });
  }
  else if (options.s3Type === 'aws'){  //Object Store like S3 or glusterFS

    //need to putObject
    var s3 = new aws.S3();
    var param = {
      Bucket: options.bucket,
      Key: req.files.sampleFile.name,
      Body: new Buffer(sampleFile.data)
    };
    s3.putObject(param, function(err, data){
      if(err) console.log(err);
      else console.log(data);
    });

  }
  else if (options.s3Type === 'gfs'){ //use this for gluster Obj Store

    var goapiserver = "http://localhost";
    var goapiserverPort = "8888";
    var method = "putFile";
    var bucket = options.bucket;

    var apiUrl = goapiserver + ':' + goapiserverPort + '/' + method + '/' + bucket +'/' + req.files.sampleFile.name;

request({
  url: apiUrl,
  method: 'POST',
  formData: {
//    'name': req.files.sampleFile.name,
    'data': new Buffer(req.files.sampleFile.data)
  }
},function (error, response, body) {
      if (error) {
        return console.error('upload failed:', error);
      }
      console.log('Upload successful!  Server responded with:', body);
 });



  } //end if gfs




//   res.send('File uploaded!');
  setTimeout(function() {
    res.redirect('/photos');
  }, 10000);
//   res.redirect('/photos');

});

app.listen(3000);
