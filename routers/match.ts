import Router from "express"
import {MatchRecord} from "../records/match.record";
import {AddNewMatch, MatchEntity} from "../types";
import {ValidationError} from "../utils/errors";

export const matchRouter = Router();

matchRouter
    .get('/', async (req, res) => {

        const matchRecords = await MatchRecord.listAll();

        const sortedData = matchRecords.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        res.json({
            // matchRecords,
            sortedData,
        });
    })

    .get('/single/:id', async (req, res) => {
        const singleMatch = await MatchRecord.getOne(req.params.id);

        res.json({
            singleMatch,
        });
    })

    .post('/', async (req, res) => {
        const newMatch = new MatchRecord(req.body as AddNewMatch);

        await newMatch.insert();

        res.json(newMatch);
    })

    .put('/edit/:id', async (req, res) => {
        const match = await MatchRecord.getOne(req.params.id);

        if(!match) {
            throw new ValidationError('No such expense!');
        }

        await match.updateRecord(req.body);

        res.json({
            answer: `OK`,
            name: req.body.name,
            match
        });
    })

    .delete('/delete/:id', async (req, res) => {
        const matchToDelete = await MatchRecord.getOne(req.params.id);

        if (!matchToDelete) {
            throw new ValidationError('No such expense!')
        }

        await matchToDelete.delete();

        res.json({
            answer: `OK`,
            name: req.body.name,
            matchToDelete,
            });
        res.end();
    })