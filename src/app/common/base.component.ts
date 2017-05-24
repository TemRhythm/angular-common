import {Location} from "@angular/common";
export abstract class BaseComponent {

    constructor(protected location: Location) {}

    goBack(){
        this.location.back();
    }
}