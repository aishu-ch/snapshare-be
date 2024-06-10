import mongoose from 'mongoose'

export const connectToMongoDB = async () => {
try{
    await mongoose.connect(process.env.DATABASE_URL)
    console.log('Successfully connected to MongoDB')
} catch (error) {
    throw error
}
}

mongoose.connection.on('Disconnected', () => {
    console.log('Disconnected from MongoDB cluster')
})