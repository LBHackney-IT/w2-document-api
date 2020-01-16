module.exports = function(options) {
  const s3 = options.s3;

  return {
    get: async function(id) {
      // try {
      //   const doc = await s3
      //     .getObject({
      //       Bucket: process.env.S3_BUCKET_NAME,
      //       Key: `${id}`
      //     })
      //     .promise();
      //   return doc.Body;
      // } catch (err) {
      //   console.log(err);
      // }
    },
    put: async function(id, document) {
      try {
        await s3
          .putObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${id}`,
            Body: document.doc
          })
          .promise();
        return true;
      } catch (err) {
        console.log(err);
        return false;
      }
    }
  };
};
