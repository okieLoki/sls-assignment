
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const conns = require('./db/connecttodb')
const Response = require('./models/response');
const BUCKET_NAME = 'descriptive-ans-upload-okieloki';
const commonMiddleware = require('./utils/commonMiddleware')

const examSubmitS3 = async (event) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({ message: "Successfully uploaded file to S3" }),
    };

    try {
        conns();
        const studentID = event.requestContext.authorizer.email;
        const parsedBody = JSON.parse(event.body);
        const check= await Response.find({questionID:parsedBody.questionID,studentID}).limit(1);
       
       if(check.length!==0){
        return{
          statusCode: 400,
          body : ' answer already exists'
        }
       } 
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${studentID}-${parsedBody.questionID}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
            ACL:'public-read'
        };

        const uploadResult = await s3.upload(params).promise();

         const dbentry = new Response({
            teacherID: parsedBody.teacherID,
            questionID: parsedBody.questionID,
            studentID,
            responsetype: 'descriptive',
            s3link: uploadResult.Location
         })
         const dbsave = await dbentry.save()

        response.body = JSON.stringify(dbsave);
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};

module.exports.handler = commonMiddleware(examSubmitS3)