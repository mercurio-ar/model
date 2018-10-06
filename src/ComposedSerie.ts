import { IPoint, ISerie } from './';

type IImageValue = number;
type IDomainValue = string | number;
type IDomain = IDomainValue[]
type IImageReducer = (imageValue1: IImageValue | undefined, imageValue2: IImageValue | undefined) => IImageValue | undefined;
type IImageMaybeValueGetter = (domainValue: IDomainValue) => IImageValue | undefined

export class ComposedSerie implements ISerie {

    id: string | number = 'serieCombinada1';
    displayName: string = 'Serie Combinada';
    children: ISerie[] = [];
    reducer: IImageReducer = (v1, v2) => {
        if(v1 && v2){
            return v1 + v2
        } else if (v1) {
            return v1
        }
        return v2
    };

    get points() {
        return this.children
            .map((child: ISerie) => child.points)
            .reduce((acc, curr) => combinePoints(acc, curr, this.reducer), []);
    }
}

function combinePoints(f1: IPoint[], f2: IPoint[], reducer: IImageReducer): IPoint[] {
    return makePoints(
        combineDomains([domain(f1), domain(f2)]),
        makeValueGetter([f1, f2], reducer)
    );
}

function domain(f: IPoint[]): IDomain {
    return f.reduce((acc: IDomain, curr: IPoint) => acc.concat(curr.x), [])
}

function combineDomains(domains: IDomain[]): IDomain {
    return Array.from(
        new Set(
            domains.reduce((acc: IDomain, domain: IDomain) =>
                acc.concat(domain),
                []
            )
        )
    );
}

function makePoints(domain: IDomain, valueGetter: IImageMaybeValueGetter): IPoint[] {
    return domain.map((domainValue: IDomainValue) => ({
        x: domainValue,
        y: valueGetter(domainValue) as number
    }));
}

function makeValueGetter(fs: IPoint[][], reducer: IImageReducer): IImageMaybeValueGetter {
    return (domainValue: IDomainValue) => {
        return fs.map((f) => makeValueGetterSingle(f))
            .map((vg) => vg(domainValue))
            .reduce(reducer)
    };
}

function makeValueGetterSingle(f: IPoint[]): IImageMaybeValueGetter {
    return (domainValue: IDomainValue) => {
        let point = f.find((point: IPoint) => point.x === domainValue)
        return point && point.y
    }
}
