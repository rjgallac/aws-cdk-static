const { Stack, Duration } = require('aws-cdk-lib');
const {Bucket, BucketAccessControl} = require("aws-cdk-lib/aws-s3");
const {BucketDeployment, Source} = require("aws-cdk-lib/aws-s3-deployment");

//cloud front
const {Distribution, OriginAccessIdentity} = require("aws-cdk-lib/aws-cloudfront");
const {S3Origin} = require("aws-cdk-lib/aws-cloudfront-origins");

const path = require("path");
// const sqs = require('aws-cdk-lib/aws-sqs');

class AwsCdkStaticStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsCdkStaticQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });

    const bucket = new Bucket(this, 'Bucket', {
      accessControl: BucketAccessControl.PRIVATE,
    })

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '../dist'))]
    })
    
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);
    
    new Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new S3Origin(bucket, {originAccessIdentity}),
      },
    })

    
  }
}

module.exports = { AwsCdkStaticStack }
