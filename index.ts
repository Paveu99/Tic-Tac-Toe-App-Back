import express, {json} from "express"
import cors from "cors"
import {handleError} from "./utils/errors";
import {matchRouter} from "./routers/match";

const app = express()

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(json());

app.use('/match', matchRouter)

app.use(handleError)

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port http://localhost:3001')
});