var aws = require('aws-sdk');

module.exports = function(res,req,options) {

  var bucket = req.params.bucket;
  var filename = req.params.filename;

  var akid = options.akid;
  var sak = options.sak;
  var s3;
  if (options.s3Type == "gfs") {
    s3 = new aws.S3({
      signatureVersion: 'v2',
      endpoint: options.clusterIP,
      s3BucketEndpoint: true,
      s3ForcePathStyle: true,
      accessKeyId: akid,
      secretAccessKey: sak,
      sslEnabled: false });
  }
  else {
    s3 = new aws.S3({
      accessKeyId: akid,
      secretAccessKey: sak,
      endpoint: options.clusterIP,
      sslEnabled: options.clusterSSL });
  }
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
