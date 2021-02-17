import { etPost } from "c/etUtils";


export default async function Shuffle_LWC(params) {
    const getData = async (output) => {
        if (params.max) {
            try {
                let result = await etPost(this, `${window.LWC_Demo.servers.API}/api/apex`, {
                    apexMethod: "post",
                    url: "/Shuffle/v1",
                    data: {
                        max: params.max
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
    }

    let output = {};
    await getData(output);
    return output;
}



