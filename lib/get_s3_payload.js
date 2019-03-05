var https = require('https');
var xmlParse = require('xml2js').parseString;
var path = require('path');
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');
const util = require('../util.js');
var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');
var aws = require('aws-sdk');

module.exports = function(userOptions, callback) {

  var photoObjects = [];
  if (userOptions.akid && userOptions.sak) {
    var s3 = new aws.S3(
      {
        accessKeyId: userOptions.akid,
        secretAccessKey: userOptions.sak,
        sslEnabled: true }
        );
  }
  else {
    var s3 = new aws.S3();
  }
  var params = {
    Bucket: userOptions.bucket,
  };
  s3.listObjects(params, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    }
    else {
      data.Contents.forEach (function(file) {
        var photoObject = {};
        if (isImage(file.Key)) {
          photoObject.src = '/getFile/' + userOptions.bucket + '/' + file.Key;
          photoObjects.push(photoObject);
        }
    }); //end for each
    }
  
    var mandatorySettings = {
      dynamic: true,
      dynamicEl: photoObjects,
      closable: false,
      escKey: false,
    };

    var optionalSettings = {
      download: true,
      thumbnail: false
    };

    var payload = objectAssign(optionalSettings, userOptions, mandatorySettings);

    callback(payload);

  });

};


