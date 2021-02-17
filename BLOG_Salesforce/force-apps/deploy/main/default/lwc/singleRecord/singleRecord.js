import { api, LightningElement, wire } from 'lwc';
import { etReport2 } from "c/etUtils";
import getFunnyName from '@salesforce/apex/GetFunnyName.lwc';

export default class SingleRecord extends LightningElement {
    @api recordId = null;
    funnyName = null;

    @wire(getFunnyName, { recordId: "$recordId" })
    wired_getFunnyName({ data, error }) {
        if (data) {
            this.funnyName = data;
        } else if (error) {
            etReport2(this, { title: `Retrieving Single Funny Record`, message: "Could not retrieve record", data: error });
        }
    }
}