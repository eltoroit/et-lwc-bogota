import { et2JSON } from "c/etUtils";

describe("c-demo-counter.et2JSON", () => {
	it("et2JSON - Test null", () => {
		let node = null;
		let value = et2JSON(node);
		expect(value).toBeNull();
	});

	it("et2JSON - Test undefined", () => {
		let node;
		let value = et2JSON(node);
		expect(value).toBeUndefined();
	});

	it("et2JSON - Test empty string", () => {
		let node = "";
		let value = et2JSON(node);
		expect(value).toBe("");
	});

	it("et2JSON - Test string", () => {
		let node = "Hello World";
		let value = et2JSON(node);
		expect(value).toBe(node);
	});

	it("et2JSON - Test array", () => {
		let node = ["Hello", "World"];
		let value = et2JSON(node);
		expect(value).toMatchObject(node);
	});

	it("et2JSON - Test with maps", () => {
		let node = new Map();
		node.set("String", "Hello World");
		let value = et2JSON(node);
		expect(value).toMatchObject(node);
	});

	it("et2JSON - Test set", () => {
		let node = new Set(["Hello", "World"]);
		let value = et2JSON(node);
		expect(value).toMatchObject(node);
	});

	it("et2JSON - Test object", () => {
		let node = { hello: "Hello", world: "World" };
		let value = et2JSON(node);
		expect(value).toMatchObject(node);
	});

	it("et2JSON - Test object with cyclic references", () => {
		let node = { h: "Hello", w: "World" };
		node.cyclic = node;
		let value = et2JSON(node, "cyclic");
		delete node.cyclic;
		expect(value).toMatchObject(node);
	});

	it("et2JSON - Test with different value types", () => {
		let node = {
			number: 5,
			boolean: true,
			date: new Date(),
			string: "Hello world",
			function: () => "Hello World",
			object: { hello: "Hello", world: "World" },
			map: new Map()
		};
		let value = et2JSON(node);
		node.function = "[function]";
		expect(value).toMatchObject(node);
	});

	it("et2JSON - Test with Array", () => {
		let node = {
			array: [1, 2, 3]
		};
		let value = et2JSON(node);
		expect(value).toMatchObject(node);
	});
});
