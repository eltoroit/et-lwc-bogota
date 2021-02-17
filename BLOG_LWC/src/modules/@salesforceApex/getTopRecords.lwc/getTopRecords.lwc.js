import { etPost } from "c/etUtils";
import BaseWire from '@salesforceapex/baseWire';

export default class GetTopRecords_LWC extends BaseWire {
    async getData(output) {
        if (this.config.howMany) {
            try {
                let result = await etPost(this, `${window.LWC_Demo.servers.API}/api/apex`, {
                    apexMethod: "post",
                    url: "/GetTopRecords/v1",
                    data: {
                        howMany: this.config.howMany
                    }
                });
                if (result.isValid) {
                    output.data = result.json.data;
                    output.error = result.json.error;
                } else {
                    throw new Error(output.message);
                }
            } catch (ex) {
                output.error = ex;
            }
        }
        return output;
    }
}
