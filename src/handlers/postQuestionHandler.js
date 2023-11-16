const connectToDatabase = require('../utils/dbConnection')
const Question = require('../models/questions')
const { v4: generateUUID } = require('uuid')
const commonMiddleware = require('../utils/commonMiddleware')
const postQuestionSchema = require('../schema/postQuestionSchema')
const { transpileSchema } = require('@middy/validator/transpile')
const validator = require('@middy/validator')
const createError = require('http-errors')


const postQuestions = async (event) => {

  connectToDatabase();

  const requestData = event.body;
  const teacherID = event.requestContext.authorizer.email;
  const questionID = generateUUID();

  if (requestData.responsetype === 'MCQ' && requestData.options.length < 2) {
    throw new createError.BadRequest('Please add atleast two options')
  }

  if (requestData.responsetype === 'descriptive') {
    requestData.options = [];
  }

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