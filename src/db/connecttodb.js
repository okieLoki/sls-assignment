const mongoose = require ('mongoose')
let conn = null;

const uri = 'mongodb+srv://royu49:rajbeer11@cluster0.mczazx6.mongodb.net/?retryWrites=true&w=majority';

async function conns(){
  if (conn == null) {
    conn = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    }).then(() => mongoose);

    await conn;
  }

  return conn;
};
module.exports=conns