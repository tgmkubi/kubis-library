const mongoose = require('mongoose');
const {MONGO_URI} = process.env;

const connectDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        console.log('MongoDb Connection Successful');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDatabase;