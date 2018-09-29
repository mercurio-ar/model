import { IPoint } from "./Point";

export interface ISerie {
    id: string | number;
    displayName: string;
    points: IPoint[];
}
