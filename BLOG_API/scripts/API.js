module.exports = class API {
    sf;
    util;

    constructor(sf, util) {
        // debugger;
        this.sf = sf;
        this.util = util;
    }

    handle(req, res, next) {
        let call = { req, res, next };
        switch (req.params.action) {
            case 'dttm': {
                call.res.status(200).json({
                    dttm: new Date(),
                    json: new Date().toJSON()
                }).end();
                break;
            }
            case 'query': {
                this.query(call);
                break;
            }
            case 'save': {
                this.save(call);
                break;
            }
            case 'apex': {
                this.apex(call);
                break;
            }
            default: {
                this.reportError(call, `Invalid API action: [${req.params.action}]`);
            }
        }
    }

    async query(call) {
        try {
            let soql = call.req.query.soql;


            let soqlResponse = await this.sf.query(soql);
            call.res.status(200).json({ data: soqlResponse });
        } catch (ex) {
            call.next(ex);
        }
    }

    async save(call) {
        try {
            let json = call.req.query.json;
            let sObject = call.req.query.sObject;

            let dmlResponse = await this.sf.saveOne(this.util.dmlOperations.UPDATE, sObject, json);
            call.res.status(200).json({ data: dmlResponse });
        } catch (ex) {
            call.next(ex);
        }
    }

    async apex(call) {
        try {
            let url = call.req.body.url;
            let body = call.req.body.data;
            let method = call.req.body.apexMethod;
            let output = await this.sf.apexCall(method, url, body);
            call.res.status(200).json(output);
        } catch (ex) {
            call.next(ex);
        }
    }


    assertEquals(call, expected, actual, message) {
        let assertResult = this.util.assertEquals(expected, actual, message);
        return this.postAssert(call, assertResult);
    }

    assertNotEquals(call, expected, actual, message) {
        let assertResult = this.util.assertNotEquals(expected, actual, message);
        return this.postAssert(call, assertResult);
    }

    assertHasData(call, value, message) {
        let assertResult = this.util.assertHasData(value, message);
        return this.postAssert(call, assertResult);
    }

    assert(call, trueValue, message) {
        let assertResult = this.util.assert(trueValue, message);
        return this.postAssert(call, assertResult);
    }

    postAssert(call, assertResult) {
        if (!assertResult.isValid) this.reportError(call, assertResult.message);
        return assertResult.isValid;
    }

    reportError(call, strMessage) {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
        // 418: I'm a teapot | The server refuses the attempt to brew coffee with a teapot ;-)
        this.util.logError("Report Error:", strMessage);
        call.res.status(418).json({ text: strMessage }).end();
    }
}
