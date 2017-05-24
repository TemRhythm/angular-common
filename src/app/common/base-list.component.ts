import {Entity} from "./entity";
import {BaseHttpService} from "./base-http.service";
import {OnInit} from "@angular/core";

export abstract class BaseListComponent<T extends Entity> implements OnInit{

    public ngOnInit() {
        this.service.getAll().then(res => this.entities = res);
    }

    entities: T[];

    constructor(protected service: BaseHttpService<T>) {}

    remove(id: number) {
        let res = confirm("Are you sure?");
        if (res)
            this.service.remove(id).then(() => this.updateList());
    }

    private updateList() {
        this.service.getAll().then(res => this.entities = res);
    }
}