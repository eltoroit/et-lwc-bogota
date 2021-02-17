import { etReport2, etSort } from "c/etUtils";
import { refreshApex } from "@salesforce/apex";
import { api, LightningElement, wire } from 'lwc';
import getTopRecords from '@salesforce/apex/GetTopRecords.lwc';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: "button", sortable: true, typeAttributes: { btnId: "Name", label: { fieldName: "Name" }, variant: "Base" } },
    { label: 'Points', fieldName: 'Points__c', type: "Number", sortable: true },
    { label: 'Random', fieldName: 'Random__c', type: "Number", sortable: true, cellAttributes: { alignment: 'right' } },
    { label: 'Pronunciation', fieldName: 'Pronunciation__c', sortable: true },
];

export default class MultipleRecords extends LightningElement {
    _howMany = 5;
    columns = COLUMNS;
    sortedBy = 'Name';
    topFunnyNames = [];
    sortedDirection = 'asc';
    resultTopRecords = null;

    @api
    get howMany() {
        return this._howMany;
    }
    set howMany(_howMany) {
        this._howMany = _howMany;
    }

    @wire(getTopRecords, { howMany: "$howMany" })
    wired_getTopRecords(result) {
        this.resultTopRecords = result;
        let { data, error } = result;
        if (data) {
            this.topFunnyNames = etSort(data, this.sortedBy, this.sortedDirection === "asc");
            this.dispatchEvent(new CustomEvent('recordselected', { detail: this.topFunnyNames[0].Id }));
        } else if (error) {
            etReport2(this, { title: `Retrieving Top Funny Records`, message: "Could not retrieve top records", data: error });
        }
    }

    onSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
        this.topFunnyNames = etSort(this.topFunnyNames, this.sortedBy, this.sortedDirection === "asc");
    }

    onRowAction(event) {
        const eventRow = event.detail.row;
        const eventAction = event.detail.action;

        switch (eventAction.btnId) {
            case "Name": {
                this.dispatchEvent(new CustomEvent('recordselected', { detail: eventRow.Id }));
                break;
            }
            default:
                break;
        }
    }

    @api
    reload() {
        refreshApex(this.resultTopRecords);
    }
}