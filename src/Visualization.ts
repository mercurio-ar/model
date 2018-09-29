import { ISerie } from './Serie';

export interface IVisualization {
    id: number;
    name: string;
    series: ISerie[];
}

export class Visualization implements IVisualization {

    public static null(): Visualization {
        return { id: NaN, name: "", series: [], getData: () => [] }
    }

    public static from({id, name, series}: IVisualization): Visualization {
        return Object.assign(new Visualization(), {id, name, series});
    }

    public id: number;
    public name: string;
    public series: ISerie[];

    public getData(): any[] {
        const data = {}
        this.series.forEach(serie => {
            serie.points.forEach(point => {
                const currentPoint = {};
                currentPoint[serie.displayName] = point.y;
                data[point.x] = Object.assign({}, (data[point.x] || {}), currentPoint);
            });
        });
        return Object.keys(data).map(key =>
            Object.assign({ date: key }, data[key])
        ).sort((a, b) =>
            Date.parse(a.date) - Date.parse(b.date)
        );
    }
}
