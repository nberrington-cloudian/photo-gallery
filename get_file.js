var aws = require('aws-sdk');

module.exports = function(res,req,options) {

  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;


  var bucket = req.params.bucket;
  var filename = req.params.filename;

  var akid = options.akid;
  var sak = options.sak;
  var s3 = new aws.S3({
      signatureVersion: 'v2',
      endpoint: options.clusterIP,
      s3BucketEndpoint: true,
      s3ForcePathStyle: true,
      accessKeyId: akid,
      secretAccessKey: sak,
      sslEnabled: false });

    var params = {
      Bucket: bucket,
      Key: filename
    };
    s3.getObject(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred

      res.writeHead(200, {'Content-Type': 'image/png' });
      res.end(data.Body, 'binary');

});


}
