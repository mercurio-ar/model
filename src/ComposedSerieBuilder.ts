import { ComposedSerie, ISerie } from './';


export class ComposedSerieBuilder {

    composedSerie: ComposedSerie;

    constructor() {
        this.composedSerie = new ComposedSerie();
    }

    build() {
        return this.composedSerie;
    }

    withChildren(children: ISerie[]) {
        this.composedSerie.children = children;
        return this;
    }
}
