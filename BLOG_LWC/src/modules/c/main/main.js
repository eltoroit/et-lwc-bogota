import { LightningElement } from 'lwc';

export default class Wrapper extends LightningElement {
    howMany = 5;
    recordId = null;

    get showCustomerPageButton() {
        return window.LWC_Demo.inOrg === "YES";
    }

    onManyChange(event) {
        this.howMany = event.detail;
    }

    onShuffle() {
        this.template.querySelector("c-multiple-records").reload();
    }

    onRecordSelected(event) {
        this.recordId = event.detail;
    }

    onCustomerPageClick() {
        window.open(window.LWC_Demo.servers.LWC);
    }
}
