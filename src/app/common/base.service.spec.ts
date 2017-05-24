import {BaseHttpService} from "./base-http.service";
import {MockClass} from "./mock-class";
import {
    BaseRequestOptions, ConnectionBackend, Http, RequestOptions, ResponseOptions, Response,
    RequestMethod
} from "@angular/http";
import {Injectable, ReflectiveInjector} from "@angular/core";
import {MockBackend} from "@angular/http/testing";
import {fakeAsync, tick} from "@angular/core/testing";

const FIRST_ITEM_TITLE = 'First Item';
const NEW_ITEM_TITLE = 'New Item';
const EDITED_ITEM_TITLE = 'Edited Item Title';

const mockData: MockClass[] = [
    {
        id: 1,
        title: FIRST_ITEM_TITLE
    },
    {
        id: 2,
        title: 'Second item'
    },
    {
        id: 3,
        title: 'Third item'
    }
];

@Injectable()
class MockService extends BaseHttpService<MockClass>{
    constructor(protected http: Http){
        super('/api/mocks',http);
    }
}

describe('MockService with MockBackend for BaseHttpService', () => {
    beforeEach(() => {
        this.injector = ReflectiveInjector.resolveAndCreate([
            {provide: ConnectionBackend, useClass: MockBackend},
            {provide: RequestOptions, useClass: BaseRequestOptions},
            Http,
            MockService
        ]);
        this.mockService = this.injector.get(MockService);
        this.backend = this.injector.get(ConnectionBackend) as MockBackend;

        this.backend.connections.subscribe((connection: any) => {
            if(connection.request.method === RequestMethod.Post && connection.request.url === '/api/mocks'){
                let newItem = JSON.parse(connection.request.getBody());
                newItem.id = mockData.length + 1;
                mockData.push(newItem);
            }
            if(connection.request.method === RequestMethod.Put && connection.request.url === '/api/mocks/'+mockData[mockData.length - 1].id){
                mockData[mockData.length - 1] = JSON.parse(connection.request.getBody());
            }

            if(connection.request.method === RequestMethod.Delete && connection.request.url === '/api/mocks/'+mockData[mockData.length - 1].id){
                mockData.pop();
            }
            this.lastConnection = connection;
        });
    });

    it('getAll() should query current service url', () => {
        this.mockService.getAll();
        expect(this.lastConnection).toBeDefined('no http service connection at all?');
        expect(this.lastConnection.request.url).toMatch(/api\/mocks$/, 'url invalid');
    });

    it('getAll() should return some data', fakeAsync(() => {
        let result: MockClass[];
        this.mockService.getAll().then((mockObjects: MockClass[]) => result = mockObjects);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData)
        })));
        tick();
        expect(result.length).toEqual(3, 'should contain given amount mock data');
        expect(result[0].title).toEqual(FIRST_ITEM_TITLE, 'First item title should be' + FIRST_ITEM_TITLE);
        expect(result[1].id).toEqual(2, 'Second item id should be 2');
    }));

    it('get() should return some data', fakeAsync(() => {
        let result: MockClass;
        this.mockService.get(1).then((mockObject: MockClass) => result = mockObject);
        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData[0])
        })));
        tick();
        expect(result.id).toBe(1, 'Item id should be ' + 1);
        expect(result.title).toBe(FIRST_ITEM_TITLE, 'Item title should be ' + FIRST_ITEM_TITLE);
    }));

    it('add() should add new item and return then', fakeAsync(() => {
        let result: MockClass;


        let addingItem = new MockClass();
        addingItem.title = NEW_ITEM_TITLE;

        this.mockService.add(addingItem).then((mockObject: MockClass) => result = mockObject);

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData[mockData.length - 1])
        })));

        tick();

        expect(result.id).toBe(4, 'Added item.id should be 4');
        expect(result.title).toBe(NEW_ITEM_TITLE, 'Added item.title should be' + NEW_ITEM_TITLE);
    }));

    it('edit() should be edit last item', fakeAsync(() =>{

        let editingItem: MockClass;
        this.mockService.get(4).then((mockObject: MockClass) => editingItem = mockObject);

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData[3])
        })));
        tick();

        expect(editingItem.title).toBe(NEW_ITEM_TITLE, "Item title should be " + NEW_ITEM_TITLE + " before editing");

        editingItem.title = EDITED_ITEM_TITLE;

        this.mockService.save(editingItem).then((res) => {
            expect(res).toBeUndefined('Save result to be undefined');
        });

        tick();

        let editedItem: MockClass;

        this.mockService.get(4).then((mockObject: MockClass) => editedItem = mockObject);

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData[3])
        })));
        tick();

        expect(editedItem.title).toBe(EDITED_ITEM_TITLE, "Edited item title should be " + EDITED_ITEM_TITLE);

    }));

    it('remove() should be delete last item', fakeAsync(() => {
        this.mockService.remove(4);
        tick();

        let mockItems: MockClass[];
        this.mockService.getAll().then((mockObjects: MockClass[]) => mockItems = mockObjects);

        this.lastConnection.mockRespond(new Response(new ResponseOptions({
            body: JSON.stringify(mockData)
        })));
        tick();

        expect(mockItems.length).toBe(3, 'after remove last item mock items count should be 3');
    }));
});