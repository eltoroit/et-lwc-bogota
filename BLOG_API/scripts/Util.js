module.exports = class Util {
    isDebug = false;

    dmlOperations = {
        INSERT: "INSERT",
        UPDATE: "UPDATE",
        UPSERT: "UPSERT"
    }

    constructor() {
        // debugger;
        this.isDebug = (process.env.ET_DEBUG === "YES");
    }

    logInfo(message, value) {
        if (this.isDebug) {
            // console.log(`ℹ️  - ${message}`, value);
            console.log(`ℹ️  - ${message}`, value !== undefined ? JSON.stringify(value) : "");
        }
    }

    logError(message, value) {
        console.error(`❌  --- START ---`);
        console.error(`❌  - ${message}`);
        console.error(`❌  -`, value);
        let stack = new Error().stack;
        stack = stack.split('\n');
        stack = stack.filter(line => line.includes('/API/scripts/'));
        stack.forEach(line => {
            console.error(`❌  - ${line}`);
        })
        console.error(`❌  --- END ---`);
    }

    makeSalesforceStatus(message) {
        return JSON.stringify({ event: message, dttmServer: new Date() });
    }

    assertEquals(expected, actual, message) {
        return this.assert(expected === actual, message);
    }

    assertNotEquals(expected, actual, message) {
        return this.assert(expected !== actual, message);
    }

    assertHasData(value, message) {
        let output = {
            message,
            isValid: true,
        }
        if (!value) {
            output.isValid = false;
        }
        return output;
    }

    assert(trueValue, message) {
        let output = {
            message,
            isValid: true,
        }
        if (typeof trueValue !== "boolean") {
            output.isValid = false;
            output.message = 'Boolean expression was expected!';
        } else {
            if (!trueValue) {
                output.isValid = false;
            }
        }
        return output;
    }
}