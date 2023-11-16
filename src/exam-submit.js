const z = require('zod')
const conns = require('./db/connecttodb')
const Response = require('./models/response');
const commonMiddleware = require('./utils/commonMiddleware')

const zodinput = z.object({
   teacherID: z.string(),
   questionID: z.string(),
   responsetype: z.string()
})

const examSubmit = async (event) => {

  try {
    conns()
   const inputdata = JSON.parse(event.body);
   const studentID = event.requestContext.authorizer.email;
   
   const parsed = zodinput.safeParse(inputdata);
        
        if(!parsed.data){
          return{
            statusCode: 400,
            body : 'enter valid inputs'
          }
        }
        

       const check= await Response.find({questionID:parsed.data.questionID,studentID}).limit(1);
       
       if(check.length!==0){
        return{
          statusCode: 400,
          body : ' answer already exists'
        }
       } 
    if(parsed.data.responsetype==='MCQ'){
      
        const savetodb = new Response({
            teacherID: parsed.data.teacherID,
            questionID: parsed.data.questionID,
            studentID,
            responsetype:'MCQ',
            response: inputdata.response
        })

        const savedtodb = await savetodb.save();
        console.log(savedtodb)
        return {
            statusCode:200,
            body : JSON.stringify(savedtodb)
        }

    } else if(parsed.data.responsetype==="descriptive") {
      
        const savetodb = new Response({
            teacherID: parsed.data.teacherID,
            questionID: parsed.data.questionID,
            studentID,
            responsetype:'MCQ',
            descriptiveresponse: inputdata.response
        })
        const savedtodb = await savetodb.save();
        return {
            statusCode:200,
            body : JSON.stringify(savedtodb)
        }
    }
    return {
      statusCode:300,
      body: 'error'
    }

  } catch (error) {
    return {
        statusCode: 500,
        body : 'internal server error'
    }
  }
};

module.exports.handler = commonMiddleware(examSubmit)