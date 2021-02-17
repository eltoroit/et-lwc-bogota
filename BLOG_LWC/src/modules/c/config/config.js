import { LightningElement } from 'lwc';
import { etReport2, etToast2 } from "c/etUtils";
import shuffle from "@salesforceApex/Shuffle.lwc";

export default class Config extends LightningElement {
    howMany = 5;
    maxRandom = 5;

    get inOrg() {
        return window.LWC_Demo.inOrg;
    }

    onHelloClick() {
        etToast2(this, { title: "Hello World", message: "Displaying a toast message" })
    }

    onHowManyChange(event) {
        let value = event.target.value;
        if (value) {
            this.howMany = value;
        } else {
            this.howMany = 0;
        }
        this.dispatchEvent(new CustomEvent('manychange', { detail: this.howMany }));
    }

    onMaxRandomChange(event) {
        let value = event.target.value;
        if (value && value > 5) {
            this.maxRandom = value;
        } else {
            this.maxRandom = 5;
        }
    }

    async onShuffleClick() {
        try {
            await shuffle({ max: this.maxRandom });
            this.dispatchEvent(new CustomEvent('shuffle'));
        } catch (ex) {
            etReport2(this, { title: `Failed to shuffle records`, message: ex.body.message, data: ex });
        }
    }
}
