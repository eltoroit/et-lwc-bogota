import { LightningElement } from 'lwc';

export default class Resources extends LightningElement {
    get logo() {
        return `${window.LWC_Demo.resources}/trailheadLogo.svg`;
    }

    renderedCallback() {
        const div = this.template.querySelector(`div[data-id="Background"]`);
        div.style.backgroundImage = `url(${window.LWC_Demo.resources}/Background.png)`;
    }
}
