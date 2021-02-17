import { LightningElement, track } from 'lwc';

export default class Events extends LightningElement {
    @track list = [];
    isVisible = true;
    isCreated = false;

    get createLabel() {
        return this.isCreated ? "Destroy" : "Create";
    }

    get showLabel() {
        return this.isVisible ? "Hide" : "Show";
    }

    onCreateClick() {
        this.isCreated = !this.isCreated;
    }

    onShowClick() {
        this.isVisible = !this.isVisible;
        let div = this.template.querySelector(`div[data-id="hidden"]`);
        let classes = div.classList;
        if (this.isVisible) {
            classes.add("slds-hidden");
        } else {
            classes.remove("slds-hidden");
        }
    }

    onAddClick() {
        this.list.push(this.list.length+1);
    }

    onRemoveClick() {
        this.list.pop();
    }
}