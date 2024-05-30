import {MatchEntity} from "./match.entity";

export type AddNewMatch = Omit<MatchEntity, 'id'>