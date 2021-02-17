export default class BaseWire {
    config;
    dataCallback = {};
    connected = false;

    constructor(dataCallback) {
        this.dataCallback = dataCallback;
    }

    connect() {
        this.connected = true;
        this.returnData(this.config);
    }

    disconnect() {
        this.connected = false;
    }

    update(config) {
        if (JSON.stringify(this.config) !== JSON.stringify(config)) {
            this.config = config;
            this.returnData(this.config);
        }
    }

    async returnData() {
        if (this.connected && this.config) {
            let output = {
                data: null, error: null,
                refreshApex: this
            };
            this.dataCallback(await this.getData(output));
        }
    }

    // Override this method
    async getData(output) {
        console.error("BASE_WIRE", "This should not be called");
        return output;
    }
}
