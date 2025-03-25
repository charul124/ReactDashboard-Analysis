const mongoose = require('mongoose');
const password = 'Dashboard@api'
const encodedpass = encodeURIComponent(password)
const connectDB = async () => {
    try{
        const conn = await mongoose.connect(
            `mongodb+srv://Charul:${encodedpass}@dashboards.ssgcg.mongodb.net/testdb?retryWrites=true&w=majority&appName=Dashboards`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
module.exports = connectDB;