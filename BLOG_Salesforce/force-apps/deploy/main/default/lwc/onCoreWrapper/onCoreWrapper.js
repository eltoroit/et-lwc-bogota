import { etReport2 } from "c/etUtils";
import { LightningElement } from 'lwc';
import ELTOROIT from "@salesforce/resourceUrl/ELTOROIT";
import getServersApex from '@salesforce/apex/GetServers.lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class OnCoreWrapper extends LightningElement {
    isReady = false;

    constructor() {
        super();
        window.LWC_Demo = {
            inOrg: "YES",
            LWC_ShowToastEvent: ShowToastEvent,
            resources: `${ELTOROIT}`
        }
    }

    connectedCallback() {
        if (!this.isReady) {
            this.getServers();
        }
    }

    async getServers() {
        try {
            window.LWC_Demo.servers = await getServersApex();
            this.isReady = true;
        } catch (ex) {
            etReport2(this, { title: `Retrieving Setup Data`, message: "Could not retrieve custom metadata", data: ex });
        }
    }
}