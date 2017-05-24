import {Http} from "@angular/http";
import {Entity} from "./entity";

import 'rxjs/add/operator/toPromise';

export abstract class BaseHttpService<T extends Entity> {

    constructor(protected baseUrl:string,
                protected http:Http){}

    getAll(): Promise<T[]>{
        return this.http.get(`${this.baseUrl}`)
            .toPromise()
            .then((res: any) => res.json() as T[]);
    }

    get(id: number): Promise<T>{
        return this.http.get(`${this.baseUrl}/${id}`)
            .toPromise()
            .then((res: any) => res.json() as T);
    }

    add(entity: T): Promise<T>{
        return this.http.post(`${this.baseUrl}`, entity)
            .toPromise()
            .then(res => res.json() as T);
    }

    save(entity: T): Promise<void>{
        return this.http.put(`${this.baseUrl}/${entity.id}`, entity)
            .toPromise()
            .then(() => {});
    }

    remove(id: number): Promise<void>{
        return this.http.delete(`${this.baseUrl}/${id}`)
            .toPromise()
            .then(() => {});
    }
}