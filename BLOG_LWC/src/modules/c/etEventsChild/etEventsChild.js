import { api, LightningElement } from 'lwc';
import myTemplate from './etEventsChild.html';

export default class EventsChild extends LightningElement {
    @api hasChild = false;
    _name = "N/A";
    index = 0;
    eventCounter = { render: 5, renderedCallback: 5 };

    @api
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }

    get childName() {
        return this.name + ' (Child)';
    }

    constructor() {
        super();
        this.advise("constructor");
    }
    connectedCallback() {
        this.advise("connectedCallback");
    }
    disconnectedCallback() {
        this.advise("disconnectedCallback");
    }
    errorCallback() {
        this.advise("errorCallback");
    }
    render() {
        let eventName = "render";
        if (this.eventCounter[eventName] > 0) {
            this.advise(eventName);
        }
        return myTemplate;
    }
    renderedCallback() {
        let eventName = "renderedCallback";
        if (this.eventCounter[eventName] > 0) {
            this.advise(eventName);
        }
    }

    advise(event) {
        let doAdvise = true;
        let data = { Id: this.index++, name: this.name, event };

        switch (event) {
            case "render":
            case "renderedCallback":
                {
                    data.count = this.eventCounter[event]--;
                    if (this.eventCounter[event] < 0) doAdvise = false;
                    break;
                }
            default:
                this.eventCounter = { render: 5, renderedCallback: 5 };
                break;
        }

        if (doAdvise) {
            console.log(JSON.stringify(data, null, 0));
        }
    }
}
