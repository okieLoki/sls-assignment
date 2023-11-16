const connectToDatabase = require('./db/connecttodb')
const Question = require('./models/questions')
const { v4: generateUUID } = require('uuid')
const commonMiddleware = require('./utils/commonMiddleware')
const postQuestionSchema = require('./schema/postQuestionSchema')
const { transpileSchema } = require('@middy/validator/transpile')
const validator = require('@middy/validator')


const postQuestions = async (event) => {

  try {

    connectToDatabase();

    const requestData = event.body;
    const teacherID = event.requestContext.authorizer.email;
    const questionID = generateUUID();

    const newQuestion = new Question({
      teacherID,
      questionID: questionID,
      title: requestData.title,
      responsetype: requestData.responsetype,
      options: requestData.options

    })

    const savedQuestion = await newQuestion.save();

    return {
      statusCode: 200,
      body: JSON.stringify(savedQuestion)
    };

  } catch (error) {

    return {
      statusCode: 500,
      body: 'Internal server error'
    }
  }
}

module.exports.handler = commonMiddleware(postQuestions)
  .use(
    validator({
      eventSchema: transpileSchema(postQuestionSchema),
      ajvOptions: {
        useDefaults: true,
        strict: false
      }
    })
  )