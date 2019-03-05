# gallery-demo
Picture viewer demo that pulls from various object stores

This started off from EPG (express-photo-gallery), which is a node module that creates an Express.js middleware function for hosting stylish and responsive photo galleries using [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/).

This is heavily -- heavily -- modified to read data from local, aws, and a custom gluster fs *[]: 

## Usage:
### Environment Variables:
This is designed to run in a container on okd/k8s and variables like bucket name, region, and s3Type are passed in as environment variables.
See the various yaml files (i.e. demo-app-aws.yaml)

However, this can also be run locally against either a gfs object store, an s3 bucket, or just locally on your hard drive. 

### Run Locally (for testing):
#### Install:
'git clone https://github.com/yard-turkey/gallery-demo.git'`

`npm install`

##### GFS
`view ./demo.config`
##### AWS
`view ./awsdemo.config`
##### Locally
`view ./localdemo.config`

#### Running:
Once the environment variables are set:

`npm start`

