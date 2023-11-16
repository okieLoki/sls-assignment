
const AWS = require("aws-sdk");
const connectToDB = require('../utils/dbConnection')
const Response = require('../models/response');
const commonMiddleware = require('../utils/commonMiddleware')
const createError = require('http-errors')
const { transpileSchema } = require('@middy/validator/transpile')
const Question = require('../models/questions');
const validator = require('@middy/validator')
const submitExamSchemaS3 = require('../schema/submitExamSchemaS3')

const s3 = new AWS.S3();
const BUCKET_NAME = 'descriptive-ans-upload-okieloki';

const examSubmitS3 = async (event) => {

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        body: JSON.stringify({
            message: "Successfully uploaded file to S3"
        }),
    };

    try {
        await connectToDB();

        const studentID = event.requestContext.authorizer.email;
        const data = event.body;

        const question = await Question.find({
            questionID: data.questionID,
        })

        if (question.length === 0) throw new createError.BadRequest('Invalid Question ID');

        const check = await Response.find({
            questionID: data.questionID,
            studentID
        }).limit(1);

        if (check.length !== 0) {
            throw new createError.Forbidden('You have already submitted your response')
        }

        const base64File = data.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${studentID}-${data.questionID}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
            ACL: 'public-read'
        };

        const uploadResult = await s3.upload(params).promise();

        const dbentry = new Response({
            teacherID: data.teacherID,
            questionID: data.questionID,
            studentID,
            responsetype: 'descriptive',
            s3link: uploadResult.Location
        })
        const dbsave = await dbentry.save()

        response.body = JSON.stringify(dbsave);
    } catch (error) {
        response.body = JSON.stringify({
            message: "File failed to upload",
            errorMessage: error.message,
        });
        response.statusCode = error.statusCode || 500;
    }

    return response;
};

module.exports.handler = commonMiddleware(examSubmitS3)
    .use(
        validator({
            eventSchema: transpileSchema(submitExamSchemaS3),
            ajvOptions: {
                useDefaults: true,
                strict: false
            }
        })
    )