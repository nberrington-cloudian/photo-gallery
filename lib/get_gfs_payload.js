var isImage = require(__dirname + '/is-image');
var objectAssign = require('object-assign');
var aws = require('aws-sdk');

module.exports = function(userOptions, callback) {

  var photoObjects = [];
  var bucket = userOptions.bucket;

  var s3 = new aws.S3({
      signatureVersion: 'v2',
      endpoint: userOptions.clusterIP,
      s3BucketEndpoint: true,
      s3ForcePathStyle: true,
      accessKeyId: userOptions.akid,
      secretAccessKey: userOptions.sak,
      sslEnabled: false });

    var params = {
      Bucket: userOptions.bucket,
    };
    s3.listObjects(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred

      data.Contents.forEach (function(file) {
            var photoObject = {};

           if (isImage(file.Key)) {
             photoObject.src = '/getFile/' + userOptions.bucket + '/' + file.Key;
             photoObjects.push(photoObject);
           }
       }); //end for each

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
