
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import quizRoute from './routes/quizRoute.js';

const app = express();


app.use(cors());

app.use('/api/quiz', express.json({ limit: "50mb" }), express.urlencoded({ limit: "50mb", extended: true }), quizRoute);

app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})