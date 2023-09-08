import express from 'express'; //express js
import cors from 'cors';    // cors 
import dotenv from 'dotenv'; // env file
dotenv.config(); // env
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// import routes
import userRoutes from './routes/userRoutes.js'


const port = process.env.PORT || 5000; //port

const app = express();

//cors
app.use(cors());

//json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser());

app.use((req, res, next) =>{
    console.log(`${req.socket.remoteAddress} is requesting ${req.method}:${req.url}`);
    next();
});

//root path
app.get('/', (req, res) => res.send('Server is ready'));
//route for user register/login/logout
app.use('/api', userRoutes);

//error handling
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
