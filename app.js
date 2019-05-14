var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var path = require("path");
var static = require('serve-static');
var aws = require('aws-sdk');
var fs = require('fs');
var str = require('str');
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
  akid: null,
  sak: null
};

// Valid options.buckets
// local : "/tmp/photos/"
// AWS S3: bucket: zac-demo-bucket1,  s3Type: "aws",Region: "us-west-1"
// Gluster: *** REQUIRES MICROSERVICES RUNNING **** bucket: bucket-demo-1, s3Type: "gfs", clusterIP: "12.34.56.78:12345"


// Go thru our expected environment values to see if they are set
var envStorageBucket1 = process.env.BUCKET_NAME;  //required //BUCKET_NAME
var envS3Type = process.env.OBJECT_STORAGE_S3_TYPE; //required
//var envStorageRegion = process.env.OBJECT_STORAGE_REGION;  //only required for AWS
var envStorageRegion = process.env.BUCKET_REGION;  //only required for AWS
//var envClusterIP = process.env.BUCKET_ENDPOINT; //only for gfs
var envClusterIP = process.env.BUCKET_HOST; //only needed for gfs
var envBucketID1 = process.env.AWS_ACCESS_KEY_ID;
var envBucketPW1 = process.env.AWS_SECRET_ACCESS_KEY;
var envBucketID2 = process.env.BUCKET_ID;
var envBucketPW2 = process.env.BUCKET_PWORD;


if (envStorageRegion) {
    options.region = envStorageRegion;
}
if (envS3Type) {
    options.s3Type = envS3Type;
}
if (envClusterIP) {
      options.clusterIP = envClusterIP;
      if (str.indexOf("amazonaws.com") > -1 {
        options.s3Type = "aws";
      }
      else {
        options.s3Type = "gfs"
      }
}
if (envStorageBucket1) {
    options.bucket = envStorageBucket1;
}
if (envBucketID2) {
      options.akid = envBucketID2;
}
if (envBucketPW2) {
      options.sak = envBucketPW2;
}
if (envBucketID1) {
      options.akid = envBucketID1;
}
if (envBucketPW1) {
      options.sak = envBucketPW1;
}


app.use(express.static('public'));
//app.use(express.static(__dirname + '/public/images'));

app.use('/photos', require(__dirname + '/index.js')(options.bucket, options));

app.get('/getFile/:bucket/:filename',function(req,res){
     require(__dirname + '/get_file.js')(res,req, options);
});

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
    var s3 = new aws.S3({
      accessKeyId: options.akid,
      secretAccessKey: options.sak,
      sslEnabled: true });
    var param = {
      Bucket: options.bucket,
      Key: req.files.sampleFile.name,
      Body: Buffer.from(sampleFile.data)
    };
    s3.putObject(param, function(err, data){
      if(err) console.log(err);
      else console.log(data);
    });

  }
  else if (options.s3Type === 'gfs'){ //use this for gluster Obj Store

    var s3 = new aws.S3({
      signatureVersion: 'v2',
      endpoint: options.clusterIP,
      s3BucketEndpoint: true,
      s3ForcePathStyle: true,
      accessKeyId: options.akid,
      secretAccessKey: options.sak,
      sslEnabled: false });

     var param = {
      Bucket: options.bucket,
      Key: req.files.sampleFile.name,
      Body: Buffer.from(sampleFile.data)
    };
    s3.putObject(param, function(err, data){
      if(err) console.log(err);
      else console.log(data);
    });

  } //end if gfs




//   res.send('File uploaded!');
  setTimeout(function() {
    res.redirect('/photos');
  }, 3000);
//   res.redirect('/photos');

});

app.listen(3000);
