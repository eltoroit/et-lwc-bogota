import { etErrorsToString } from "c/etUtils";

describe("c-demo-counter.etErrors", () => {
	it("etErrors - body has null and undefined array elements", () => {
		let value = etErrorsToString([null, { body: [{ message: "ERROR1" }, { message: "ERROR2" }] }, undefined]);
		expect(value).toBe("ERROR1, ERROR2");
	});

	it("etErrors - body is Array", () => {
		let value = etErrorsToString([{ body: [{ message: "ERROR1" }, { message: "ERROR2" }] }]);
		expect(value).toBe("ERROR1, ERROR2");
	});

	it("etErrors - body.message", () => {
		let value = etErrorsToString({ body: { message: "ERROR1" } });
		expect(parseJSON(value)).toMatchObject({ message: "ERROR1" });
	});

	it("etErrors - Unpackage objects", () => {
		let body = { message: { Text: "ERROR1", Value: 1 } };
		let value = etErrorsToString({ body });
		expect(parseJSON(value)).toMatchObject(body);
	});

	it("etErrors - No body, just message", () => {
		let value = etErrorsToString({ message: "ERROR1" });
		expect(parseJSON(value)).toMatchObject({ message: "ERROR1" });
	});

	it("etErrors - No body, just statusText", () => {
		let value = etErrorsToString({ statusText: "ERROR1" });
		expect(value).toBe("ERROR1");
	});

	it("etErrors - No body, something else", () => {
		let value = etErrorsToString({ somethingElse: "ERROR1" });
		expect(value).toBe('("somethingElse":"ERROR1")');
	});

	it("etErrors - No array, just a string", () => {
		let value = etErrorsToString("ERROR1");
		expect(value).toBe("ERROR1");
	});

	it("etErrors - cyclic object does not display properly, but it's handled", () => {
		let error = {};
		error.err = error;
		let value = etErrorsToString(error);
		expect(value).toBe("[object Object]");
	});

	function parseJSON(value) {
		return JSON.parse(value.replace(/\(/g, "{").replace(/\)/g, "}"));
	}
});
