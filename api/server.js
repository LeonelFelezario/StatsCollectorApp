import express from 'express'; //express js
import cors from 'cors';    // cors 
import dotenv from 'dotenv'; // env file
dotenv.config(); // env

const port = process.env.PORT || 5000; //port

const app = express();

//cors
app.use(cors());

//json parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use((req, res, next) =>{
    console.log(`${req.socket.remoteAddress} is requesting ${req.method}:${req.url}`);
    next();
});

//root path
app.get('/', (req, res) => res.send('Server is ready'));


app.listen(port, () => console.log(`Server started on port ${port}`));