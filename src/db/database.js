const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const uri = process.env.MONGO_URL;
mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true

}).catch((e) => console.log(e));