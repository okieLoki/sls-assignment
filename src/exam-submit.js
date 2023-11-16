const connectToDB = require('./db/connecttodb')
const Response = require('./models/response');
const commonMiddleware = require('./utils/commonMiddleware')
const { transpileSchema } = require('@middy/validator/transpile')
const validator = require('@middy/validator')
const submitExamSchema = require('./schema/submitExamSchema')
const createError = require('http-errors')

const examSubmit = async (event) => {

  try {

    connectToDB()

    const inputdata = event.body;
    const studentID = event.requestContext.authorizer.email;

    const check = await Response.find({
      questionID: inputdata.questionID,
      studentID
    }).limit(1);

    if (check.length !== 0) {
      throw new createError.Forbidden('You have already submitted your response')
    }

    if (inputdata.responsetype === 'MCQ') {

      const savetodb = new Response({
        teacherID: inputdata.teacherID,
        questionID: inputdata.questionID,
        studentID,
        responsetype: 'MCQ',
        response: inputdata.response
      })

      const savedtodb = await savetodb.save();

      return {
        statusCode: 200,
        body: JSON.stringify(savedtodb)
      }

    } else if (inputdata.responsetype === "descriptive") {

      const savetodb = new Response({
        teacherID: inputdata.teacherID,
        questionID: inputdata.questionID,
        studentID,
        responsetype: 'MCQ',
        descriptiveresponse: inputdata.response
      })
      const savedtodb = await savetodb.save();
      return {
        statusCode: 200,
        body: JSON.stringify(savedtodb)
      }
    }

  } catch (error) {

    return {
      statusCode: error.statusCode || 500,
      body: error.message || 'Internal server error'
    }
  }
};

module.exports.handler = commonMiddleware(examSubmit)
  .use(
    validator({
      eventSchema: transpileSchema(submitExamSchema),
      ajvOptions: {
        useDefaults: true,
        strict: false
      }
    })
  )