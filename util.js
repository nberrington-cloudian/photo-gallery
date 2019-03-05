exports.isObjectStore = function(options) {
  return (options.s3Type === 'aws') || (options.s3Type === 'gfs');

};
exports.buildS3url = function(options) {
    var s3 = this.isObjectStore(options);

    var bucket = options.bucket;

    if (!s3) {
      const path = options.bucket;
      return path.substr(-1) != '/' ? path + '/' : path;
    }

    var s3url = '';
    if (options.s3Type == "aws") {
        s3url = 'https://' + bucket ;
        if (options.region) {
          s3url += '.s3-' + options.region +'.amazonaws.com/';
        }
        else {
          s3url += '.s3.amazonaws.com/';
        }
    }
    else if (options.s3Type == "gfs") {
        s3url = 'http://' + options.clusterIP  + '/' + bucket ;  //NOT used if using microservices
    }
    else {
      s3url = options.bucket;
    }
    return s3url;
};