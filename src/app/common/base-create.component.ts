import {BaseComponent} from "./base.component";
import {Entity} from "./entity";
import {BaseHttpService} from "./base-http.service";
import {Location} from "@angular/common";

export abstract class BaseCreateComponent<T extends Entity> extends BaseComponent {

    constructor(location: Location,
                protected service: BaseHttpService<T>,
                protected entity: Entity) {
        super(location);
    }

    onSubmit() {
        this.service.add(this.entity as T).then((res) => this.onCreate(res, true));
    }

    onCreate(result: T, needGoBack = false){
        if(needGoBack) this.goBack();
    }
}