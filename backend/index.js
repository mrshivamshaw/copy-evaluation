import express from 'express';
import dbconnect from './config/database.js';
import { config as configDotenv } from 'dotenv';
import authRoute from './routes/auth.js';
import adminRoute from './routes/admin.js';
import userRoute from './routes/userRoute.js';
import { cloudinaryset } from './config/cloudinary.js';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import teacherRoute from './routes/teacher.js';
import studentRoute from './routes/student.js';

configDotenv();
cloudinaryset();

const port = process.env.PORT || 5000;
const app = express();

app.use(cors(
    {
        origin:["http://localhost:5173"],
        methods:["POST","GET","PUT","DELETE"],
        credentials:true
    }
))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/teacher', teacherRoute);
app.use('/api/v1/student', studentRoute);


app.get('/', (req, res) => {
    res.send("server is running");
});

app.listen(port, () => {
    console.log("server is running at port", port);
    dbconnect();
});
