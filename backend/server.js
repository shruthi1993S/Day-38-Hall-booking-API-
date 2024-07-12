const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
require('dotenv').config(); // Ensure this is called early

const app = express();
app.use(bodyParser.json());
app.use('/api', apiRoutes);

mongoose.connect(process.env.MONGODB_URI).then(()=>{
    console.log("MONGODB Connected Successfully!!")
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running in the port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("Error occured:",err.message)
})