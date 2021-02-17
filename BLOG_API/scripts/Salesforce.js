const jsforce = require('jsforce');

module.exports = class Salesforce {
    util;
    conn;
    userInfo;
    isConnected = false;
    serverSF = "UNKNOWN";

    constructor(util) {
        // debugger;
        this.util = util;
        this.isConnected = false;
        this.conn = new jsforce.Connection({ loginUrl: process.env.SF_SERVER, version: '50.0' });
        this.conn.login(process.env.SF_USERNAME, process.env.SF_PASSWORD, (err, userInfo) => {
            if (err) {
                this.util.logError("Failed to login! (1):", err);
                throw new Error(err);
            }
            this.userInfo = userInfo;
            this.util.logInfo("login details (1):", userInfo);
            this.conn.identity((err2, res) => {
                if (err2) {
                    this.util.logError("Failed to find identification information!", err2);
                    throw new Error(err2);
                }
                let log = { username: res.username, domain: res.urls.custom_domain };
                this.serverSF = res.urls.custom_domain;
                this.util.logInfo("Identity:", log);
                this.isConnected = true;
            });

        }).then((...data) => {
            this.util.logInfo("login details (2):", data);
        }).catch((...error) => {
            this.util.logError("Failed to login! (2):", error);
            throw new Error(error);
        });
    }

    query(SOQL) {
        this.util.logInfo('Query:', SOQL);
        let output = {
            SOQL,
            totalSize: -1,
            totalFetched: -1,
            records: [],
            error: null
        };
        return new Promise((resolve, reject) => {
            if (!this.util.assertNotEquals(null, this.isConnected).isValid) this.reportError(reject, "Not conected yet");
            if (SOQL) {
                let query = this.conn.query(SOQL)
                    .on("record", record => {
                        this.removeURL(record);
                        output.records.push(record);
                    })
                    .on("end", () => {
                        output.totalSize = query.totalSize;
                        output.totalFetched = query.totalFetched;
                        resolve(output);
                    })
                    .on("error", error => {
                        output.error = error.toString();
                        this.util.logError("Error on query:", output);
                        reject(JSON.stringify(output));
                    })
                    .run({ autoFetch: true, maxFetch: 4000 });
            } else {
                output.error = "SOQL not provided for query";
                this.util.logError(output.error, output);
                reject(JSON.stringify(output));
            }
        })
    }

    saveOne(operation, SObjectNameAPI, fields, externalId) {
        let output = {
            fields,
            Id: null,
            operation, // "INSERT" || "UPDATE" || "UPSERT"
            externalId,
            error: null,
            SObjectNameAPI,
        };
        return new Promise((resolve, reject) => {
            if (!this.util.assertNotEquals(null, this.isConnected).isValid) this.reportError(reject, "Not conected yet");
            if (!this.util.assertHasData(SObjectNameAPI).isValid) this.reportError(reject, "Did not receive an SObjectNameAPI", output);
            if (!this.util.assertHasData(operation).isValid) this.reportError(reject, "Did not receive the operation", output);
            if (!this.util.assertEquals(this.util.dmlOperations[operation], operation).isValid) this.reportError(reject, `Operation [${operation}] was not expected`, output);
            if (!this.util.assertHasData(fields).isValid) this.reportError(reject, "Did not receive the fields for the data", output);
            if (operation === "UPSERT" && !this.util.assertHasData(externalId).isValid) this.reportError(reject, "Did not provide externalId for upsert", output);

            const handleResponse = (error, response) => {
                if (error || !response.success) {
                    output.error = error;
                    output.response = response;
                    this.util.logError("Error on saving", output);
                    reject(JSON.stringify(output));
                } else {
                    output.Id = response.id;
                    output.response = response;
                    resolve(output);
                }
            }

            let sObj = this.conn.sobject(SObjectNameAPI);
            if (operation === this.util.dmlOperations.INSERT) {
                sObj.create(fields, handleResponse.bind(this));
            } else if (operation === this.util.dmlOperations.UPDATE) {
                sObj.update(fields, handleResponse.bind(this));
            } else if (operation === this.util.dmlOperations.UPSERT) {
                sObj.upsert(fields, externalId, handleResponse.bind(this));
            } else {
                output.error = `Invalid operation [${operation}] received`;
                this.util.logError(output.error, output);
                reject(JSON.stringify(output));
            }
        });
    }

    apexCall(method, url, body) {
        let output = {
            data: null,
            error: null
        }
        return new Promise((resolve, reject) => {
            try {
                if (!this.util.assertNotEquals(null, this.isConnected).isValid) throw new Error("Not conected yet");
                if (!this.util.assertHasData(method).isValid) throw new Error("Did not receive a 'method'");
                if (!this.util.assertHasData(url).isValid) throw new Error("Did not receive a 'url'");
                if (!this.util.assertHasData(body).isValid) throw new Error("Did not receive a 'body'");
                if (!this.util.assertEquals(method, "post").isValid) throw new Error(`unexpected method [${method}], expecting "post"`);

                const handleResponse = (error, data) => {
                    if (error) {
                        output.error = error;
                        this.util.logError(error, error);
                    } else if (data) {
                        output.data = data;
                    }
                    resolve(output);
                }
                this.conn.apex[method](url, body, handleResponse.bind(this));
            } catch (ex) {
                debugger;
                let message = ex.message;
                output.error = message;
                this.util.logError(message, ex);
                resolve(output);
            }
        });
    }

    reportError(reject, message, data) {
        debugger;
        this.util.logError(message, data);
        reject(JSON.stringify(message));
    }

    removeURL(record) {
        for (let prop in record) {
            if (prop === "attributes") {
                let type = record[prop].type;
                delete record[prop];
                record.type = type;
            }
            else if (typeof record[prop] === 'object') {
                this.removeURL(record[prop]);
            }
        }
    }

}