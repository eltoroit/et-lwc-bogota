import { etToast, etToastTest, etReport, etSort, etSortPrimitives, etTimer, etLogTime, etLog, etFlushPromises, etDelay } from "c/etUtils";

describe("c-demo-counter.General", () => {
	afterEach(() => {
		// The jsdom instance is shared across test cases in a single file so reset the DOM
		while (document.body.firstChild) {
			document.body.removeChild(document.body.firstChild);
		}
	});

	it("etLog with label", () => {
		etLog({}, "Label");
		expect(1).toBe(1);
	});

	it("etLog without label", () => {
		etLog({});
		expect(1).toBe(1);
	});
	it("etToastTest", () => {
		const handleEvent = jest.fn();

		const element = document.body;
		element.addEventListener("lightning__showtoast", handleEvent);

		etToastTest(element);
		expect(handleEvent).toBeCalledTimes(1);
	});

	it("etToast", () => {
		const handleEvent = jest.fn();

		const element = document.body;
		element.addEventListener("lightning__showtoast", handleEvent);

		etToast(element, "title", "message", "dismissable", "error");
		expect(handleEvent).toBeCalledTimes(1);
	});

	it("etReport", () => {
		const handleEvent = jest.fn();

		const element = document.body;
		element.addEventListener("lightning__showtoast", handleEvent);

		try {
			etReport(element, "errors");
		} catch (ex) {
			//
		}
		expect(handleEvent).toBeCalledTimes(1);
	});

	it("etSortPrimitives ASC", () => {
		let list = [2, 4, 3, 5, 1, 0];

		let sorted = etSortPrimitives(list, true);
		for (let i = 0; i <= 5; i++) {
			expect(sorted[i]).toBe(i);
		}
	});

	it("etSortPrimitives DESC", () => {
		let list = [2, 4, 3, 5, 1, 0];

		let sorted = etSortPrimitives(list, false);
		for (let i = 0; i <= 5; i++) {
			expect(sorted[5 - i]).toBe(i);
		}
	});

	it("etSort ASC", () => {
		let list = [
			{ number: 1, letter: "A" },
			{ number: 4, letter: "B" },
			{ number: 3, letter: "C" },
			{ number: 5, letter: "D" },
			{ number: 2, letter: "E" }
		];

		let sorted = etSort(list, "number", true);
		for (let i = 0; i < list.length; i++) {
			expect(sorted[i].number).toBe(i + 1);
		}
	});

	it("etSort DESC", () => {
		let list = [
			{ number: 1, letter: "A" },
			{ number: 4, letter: "B" },
			{ number: 3, letter: "C" },
			{ number: 5, letter: "D" },
			{ number: 2, letter: "E" }
		];

		let sorted = etSort(list, "number", false);
		for (let index = 0; index < list.length; index++) {
			let expected = list.length - index;
			expect(sorted[index].number).toBe(expected);
		}
	});

	it("Timers", async () => {
		let value;
		let start;
		let message = "TEST1";

		expect(etTimer).toMatchObject({ start: null, last: null });

		// First Message
		// value:   { ms: { start: -1, last: -1 }, message: message }
		// etTimer: { start: 2020-08-07T14:58:53.737Z, last: 2020-08-07T14:58:53.737Z }
		message = "TEST1";
		value = etLogTime(message);
		start = etTimer.start;
		expect(etTimer.start).toBe(etTimer.last);
		expect(new Date() - etTimer.start).toBeLessThan(100);
		expect(new Date() - etTimer.last).toBeLessThan(100);
		expect(value.ms.start).toBe(-1);
		expect(value.ms.last).toBe(-1);
		expect(value.message).toBe(message);

		// Wait one second
		await etDelay(1000);

		// Second Message
		// value:   { ms: { start: 1028, last: 1028 }, message: 'TEST2' }
		// etTimer: { start: 2020-08-07T15:04:32.641Z, last: 2020-08-07T15:04:33.669Z }
		message = "TEST2";
		value = etLogTime(message);
		expect(etTimer.start).toBe(start);
		expect(new Date() - etTimer.last).toBeLessThan(100);
		expect(etTimer.last - etTimer.start - 1000).toBeLessThan(100);
		expect(value.ms.start - 1000).toBeLessThan(100);
		expect(value.ms.last - 1000).toBeLessThan(100);
		expect(value.message).toBe(message);

		// Wait anoter second
		await etDelay(1000);

		// Second Message
		// value:   { ms: { start: 2047, last: 1013 }, message: 'TEST3' }
		// etTimer: { start: 2020-08-07T15:10:50.127Z, last: 2020-08-07T15:10:52.174Z }
		message = "TEST3";
		value = etLogTime(message);
		expect(etTimer.start).toBe(start);
		expect(new Date() - etTimer.last).toBeLessThan(100);
		expect(etTimer.last - etTimer.start - 2000).toBeLessThan(100);
		expect(value.ms.start - 2000).toBeLessThan(100);
		expect(value.ms.last - 1000).toBeLessThan(100);
		expect(value.message).toBe(message);
	});

	it("etFlushPromises", async () => {
		await etFlushPromises();
		expect(1).toBe(1);
	});
});
