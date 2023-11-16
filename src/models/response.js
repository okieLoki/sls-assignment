const mongoose = require ('mongoose')

const responseSchema = new mongoose.Schema({
    teacherID:{
        type: String,
        required: true
    },
    questionID:{
        type: String,
        required: true
    },
    studentID:{
        type: String,
        required: true
    },
    response:{
        type: String,
        enum: ['a', 'b', 'c', 'd'],
    },
    descriptiveresponse:{
        type: String
    },
    responsetype:{
        type: String,
        enum: ['MCQ','descriptive']
    },
    s3link:{
        type: String
    }
})

 Response = mongoose.model("response",responseSchema)
 module.exports= Response