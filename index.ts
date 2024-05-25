import express, {json} from "express"
import cors from "cors"
import {handleError} from "./utils/errors";
import {matchRouter} from "./routers/match";
import morgan from "morgan";

const app = express()

app.use(cors({
    origin: ['http://localhost:5173']
}));

app.use(morgan("dev"))

app.use(json());

app.use('/match', matchRouter)

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001')
});