/* eslint-disable @lwc/lwc/no-inner-html */
/* eslint-disable no-restricted-globals */
/* eslint-disable @lwc/lwc/no-document-query */

import '@lwc/synthetic-shadow';
import App from 'c/main';
import Toastify from 'toastify-js'
import { createElement } from 'lwc';

function initialize() {
    let serverAPI = null;
    let origin = window.location.origin;
    if (origin.indexOf("localhost") > 0) {
        serverAPI = "https://localhost:3003";
    } else {
        serverAPI = "https://et-lwc-demo.herokuapp.com";
    }

    window.LWC_Demo = {
        inOrg: "NO",
        toastify: Toastify,
        resources: `/resources/ELTOROIT`,
        servers: {
            API: serverAPI,
            LWC: window.location.origin
        }
    }

    let destination = document.querySelector('#main');
    destination.innerHTML = '';

    const app = createElement('c-main', { is: App });
    destination.appendChild(app);
}

initialize();
