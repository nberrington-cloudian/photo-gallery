# gallery-demo
Picture viewer demo that pulls from various object stores

This started off from EPG (express-photo-gallery), which is a node module that creates an Express.js middleware function for hosting stylish and responsive photo galleries using [jQuery lightgallery](http://sachinchoolur.github.io/lightGallery/).

This is heavily -- heavily -- modified to read data from local, aws, and a gluster fs which is access through other microservices (see my golang-object-store-service)*[]: 

## Usage:

#### Install:
'git clone https://github.com/zherman0/gallery-demo.git'
`npm install`

#### Environment Variables:
Since this is meant to be run in a container, pass in variables through imports or use the demo files
`. ./demo.config`

#### Run:

`node app.js`

