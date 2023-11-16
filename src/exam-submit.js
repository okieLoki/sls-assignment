const connectToDatabase = require('./db/connecttodb');
const Response = require('./models/response');
const commonMiddleware = require('./utils/commonMiddleware')
const createError = require('http-errors')
const { transpileSchema } = require('@middy/validator/transpile')
const validator = require('@middy/validator')
const submitExamSchema = require('./schema/submitExamSchema')

const submitExam = async (event) => {

  connectToDatabase();

  const inputdata = event.body
  const studentID = event.requestContext?.authorizer?.email;

  console.log(event.requestContext.authorizer.email)

  const check = await Response.find({
    questionID: inputdata.questionID,
    studentID,
  }).limit(1);

  if (check.length !== 0) {
    throw new createError.BadRequest('You have already submitted your response');
  }

  if (inputdata.responsetype === 'MCQ') {
    const savetodb = new Response({
      teacherID: inputdata.teacherID,
      questionID: inputdata.questionID,
      studentID,
      responsetype: inputdata.responsetype,
      response: inputdata.response,
    });

    const savedtodb = await savetodb.save();
    console.log(savedtodb);

    return {
      statusCode: 200,
      body: JSON.stringify(savedtodb),
    };
  } else if (inputdata.responsetype === 'descriptive') {
    const savetodb = new Response({
      teacherID: inputdata.teacherID,
      questionID: inputdata.questionID,
      studentID,
      responsetype: inputdata.responsetype,
      descriptiveresponse: inputdata.response,
    });

    const savedtodb = await savetodb.save();
    return {
      statusCode: 200,
      body: JSON.stringify(savedtodb),
    };
  }
  else {
    throw new createError.BadRequest('Invalid Input');
  }
}

exports.handler = commonMiddleware(submitExam)
  .use(
    validator({
      eventSchema: transpileSchema(submitExamSchema),
      ajvOptions: {
        useDefaults: true,
        strict: false
      }
    })
  )