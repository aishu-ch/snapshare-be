import * as dotenv from 'dotenv'
import express from 'express'
import { connectToMongoDB } from './config/database.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import { cloudinaryConfig } from './config/cloudinary.js'
import userRoutes from './routes/user.js'
import profileRoutes from './routes/profile.js'
import postRoutes from './routes/post.js'
import commentRoutes from './routes/comment.js'

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
app.use('/api/user', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)


// Connecting to server
  app.listen(process.env.PORT, (error) =>{
    if(!error){
        connectToMongoDB()
        console.log(`Server is Successfully Running on ${process.env.PORT}`)}
    else
        console.log("Error occurred, server can't start", error);
    }
);