# angular-s3-viewer

Display Amazon S3 bucket contents in a tree style view.

![Screenshot1](https://s3.amazonaws.com/restiolabs.com/example2.jpg)
<br/><br/>

### Prerequisites
* AWS account API key and secret
* An S3 Bucket with some folders and files


### Steps to build
```
# clone the repo, then
cd angular-s3-viewer
npm install
cd angular-src
npm install
```

### To Execute 
```
# you'll need 2 terminals, in terminal 1 go to source root and start the nodejs server
S3KEY="yourkey" S3SECRET="yoursecret" S3BUCKET="bucketname" npm run dev-api

# in terminal 2, go to the source root, then
cd angular-src
ng serve

# open your brower at `localhost:4200`
```

Note: 
* The angular dev server by default listens at port 4200, it can be changed with the --port cmd line arg.
* The nodejs server will listen at port 3000 by default, it can be changed with the PORT env variable.
* If the nodejs port is changed, then update the client here: `angular-src/src/app/file.service.ts`

