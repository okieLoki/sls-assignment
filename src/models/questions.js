const mongoose = require ('mongoose')
const questionSchema = new mongoose.Schema({
    teacherID:{
        type: String,
        required: true
    },
    questionID:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    responsetype:{
        type: String,
        enum: ['MCQ','descriptive']
    },
    options:{
        type:[String]
    }

})

 Question = mongoose.model("question",questionSchema)
 
 module.exports= Question