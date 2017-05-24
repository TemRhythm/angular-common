import {Entity} from "./entity";
import {BaseComponent} from "./base.component";
import {Location} from "@angular/common";
import {ActivatedRoute, Params} from "@angular/router";
import {BaseHttpService} from "./base-http.service";
import {OnInit} from "@angular/core";

import 'rxjs/add/operator/switchMap';

export abstract class BaseEditComponent<T extends Entity> extends BaseComponent implements OnInit{

    protected entity: T;

    constructor(location: Location,
                protected route: ActivatedRoute,
                protected service: BaseHttpService<T>){
        super(location);
    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) =>
                this.service.get(+params['id']))
            .subscribe((res: T) => {
                this.entity = res;
                this.onEntityReceived();
            });
    }

    onSubmit() {
        this.service.save(this.entity).then(() => this.goBack(), error => console.log(error));
    }

    onEntityReceived(): void { }
}