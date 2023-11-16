const connectToDatabase = require('./db/connecttodb')
const Question = require("./models/questions");
const createError = require('http-errors');
const getQuestionsSchema = require('./schema/getQuestionsSchema')
const { transpileSchema } = require('@middy/validator/transpile')
const validator = require('@middy/validator')
const commonMiddleware = require('./utils/commonMiddleware')


const getQuestions = async (event) => {

  connectToDatabase();

  const id = event.queryStringParameters.id;

  const countMCQ = Math.floor(Math.random() * 10);
  const countDesc = 10 - countMCQ;

  const MCQS = await Question.find({
    responsetype: 'MCQ',
    teacherID: id
  }).limit(countMCQ)

  const DESC = await Question.find({
    responsetype: 'descriptive',
    teacherID: id
  }).limit(countDesc)

  const questionpaper = await MCQS.concat(DESC);

  if (questionpaper.length === 0) {
    throw createError.NotFound('No Questions Found')
  }

  return {
    statusCode: 200,
    body: JSON.stringify(questionpaper),
  };

}

module.exports.handler = commonMiddleware(getQuestions)
  .use(
    validator({
      eventSchema: transpileSchema(getQuestionsSchema),
      ajvOptions: {
        useDefaults: true,
        strict: false
      }
    })
  )