import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
// permet de faire la lecture dans le fichier .env
import dotenv from 'dotenv'; 
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import moduleRoutes from './routes/module.route.js';
import questionRoute from './routes/question.route.js';
import tagRoute from './routes/tag.route.js';
import formRoute from './routes/form.route.js';
import questionnaireRoute from './routes/questionnaire.route.js';
import userChoice from './routes/userChoice.route.js';
import answerRoute from './routes/answer.route.js'

import path from 'path';

dotenv.config();
mongoose
.connect(process.env.MONGO)
.then(
    () => {
        console.log('mongo db is connected');
    }
).catch(err => {
    console.log(err);
});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log("serv sur port 3000");
});

// doit utiliser 'use' au lieu de get
app.use('/api/user', userRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/module',moduleRoutes);
app.use('/api/question', questionRoute);
app.use('/api/tag', tagRoute);
app.use('/api/form', formRoute);
app.use('/api/questionnaire', questionnaireRoute);
app.use('/api/userChoice',userChoice);
app.use('/api/answer', answerRoute);

app.use(express.static(path.join(__dirname, '../guinanutri/dist')));

app.get('*', (req, res ) => {
    res.sendFile(path.join(__dirname, 'guinanutri', 'dist', 'index.html'));
});

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})
