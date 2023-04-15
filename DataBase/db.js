const DB_URL = 'mongodb+srv://doadmin:0826K7O1vyLBr43Z@workshiredb-302d8fca.mongo.ondigitalocean.com/UserData?tls=true&authSource=admin&replicaSet=workshiredb';
const mongoose = require('mongoose');

const connectDataBase = ()=>{
  mongoose.set('strictQuery',true);
  mongoose.connect(DB_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(db => console.log('DB is connected'))
.catch(err => console.log(err));
}
module.exports = connectDataBase
