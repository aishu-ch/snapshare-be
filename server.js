import * as dotenv from 'dotenv'
import express from 'express'
import { connectToMongoDB } from './config/database.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import { cloudinaryConfig } from './config/cloudinary.js'

const app = express()
dotenv.config()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json({limit: '5mb'}))
app.use('*', cloudinaryConfig)


app.get('/', (req, res) => {
    res.send('Share your snaps on SnapShare!')
  })

// Backend API routes

// Connecting to server
  app.listen(process.env.PORT, (error) =>{
    if(!error){
        connectToMongoDB()
        console.log(`Server is Successfully Running on ${process.env.PORT}`)}
    else
        console.log("Error occurred, server can't start", error);
    }
);