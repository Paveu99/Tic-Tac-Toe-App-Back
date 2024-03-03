import {MatchEntity} from "../types";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2"
import {v4 as uuid} from "uuid"
import { format } from 'date-fns';

type MatchRecordResults =[MatchRecord[], FieldPacket[]];

export class MatchRecord implements MatchEntity {
    public player1: string;
    public player2: string;
    public gameTime: number;
    public numberOfMoves: number;
    public id: string;
    public date: string;
    public winner: string;

    constructor(obj: MatchEntity) {
        this.id = obj.id;
        this.player1 = obj.player1;
        this.player2 = obj.player2;
        this.gameTime = obj.gameTime;
        this.numberOfMoves = obj.numberOfMoves;
        this.winner = obj.winner;
        this.date = obj.date;
    };

    static async listAll(): Promise<MatchRecord[]> {
            const [results] = await pool.execute("SELECT * FROM `results`") as MatchRecordResults;

            results.forEach((expense: any) => {
                const parsedDate: Date = new Date(expense.date);
                parsedDate.setDate(parsedDate.getDate() + 1);
                expense.date = parsedDate.toISOString().split('T')[0];
            });

            return results.map(obj => new MatchRecord(obj));
        };

    static async getOne(id: string): Promise<MatchRecord> | null {
        const [results] = await pool.execute("SELECT * FROM `results` WHERE `id` = :id", {
            id,
        }) as MatchRecordResults;

        results.forEach((expense: any) => {
            const parsedDate: Date = new Date(expense.date);
            parsedDate.setDate(parsedDate.getDate() + 1);
            expense.date = parsedDate.toISOString().split('T')[0];
        });

        return results.length === 0 ? null : new MatchRecord(results[0])
    };

    async insert(): Promise<void> {
        if(!this.id) {
            this.id = uuid()
        }

        await pool.execute("INSERT INTO `results` VALUES(:id, :player1, :player2, :gameTime, :numberOfMoves, :winner, :date)", {
            id: this.id,
            player1: this.player1,
            player2: this.player2,
            gameTime: this.gameTime,
            numberOfMoves: this.numberOfMoves,
            winner: this.winner,
            date: this.date,
        });
    };

    async updateRecord(body: MatchEntity): Promise<void> {
        await pool.execute("UPDATE `results` SET `player1` = :player1, `player2` = :player2, `gameTime` = :gameTime, `numberOfMoves` = :numberOfMoves, `winner` = :winner, `date` = :date WHERE `id` = :id", {
            id: this.id,
            player1: this.player1,
            player2: this.player2,
            gameTime: this.gameTime,
            numberOfMoves: this.numberOfMoves,
            winner: this.winner,
            date: this.date,
        });
    };

    async delete(): Promise<void> {
        await pool.execute("DELETE FROM `results` WHERE `id` = :id", {
            id: this.id
        });
    };
}