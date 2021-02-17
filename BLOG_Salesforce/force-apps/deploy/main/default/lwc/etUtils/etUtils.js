
const replaceBrackets = (text) => {
	text = text.replace(/{/g, "(");
	text = text.replace(/}/g, ")");
	return text;
}

const etErrorsToString = (errors) => {
	// https://developer.salesforce.com/docs/component-library/documentation/en/lwc/data_error (too generic)
	// https://developer.salesforce.com/blogs/2020/08/error-handling-best-practices-for-lightning-web-components.html
	// Make array if only one.
	if (!Array.isArray(errors)) {
		errors = [errors];
	}

	// Remove null/undefined items
	errors = errors.filter((error) => !!error);

	// Extract an error message
	errors = errors.map((error) => {
		// UI API read errors
		if (Array.isArray(error.body)) {
			return error.body.map((e) => e.message);
		}

		// JS errors
		if (typeof error.message === "string") {
			return JSON.stringify({ name: error.name, message: error.message }, null, 2);
		}

		// UI API DML, Apex and network errors
		if (error.body) {
			try {
				let errorBody = JSON.stringify(error.body, null, 2);
				return errorBody;
			} catch (ex) {
				// Ignore conversion errors
			}
		}

		// Unknown error shape so try HTTP status text
		if (error.statusText) {
			return error.statusText;
		}

		if (typeof error === "string") {
			return error;
		}

		try {
			return JSON.stringify(error);
		} catch (ex) {
			return error;
		}
	});

	// Flatten
	errors = errors.reduce((prev, curr) => prev.concat(curr), []);

	// Remove empty strings
	errors = errors.filter((message) => !!message);

	// Make it a string
	errors = errors.join(", ");

	// Replace curly brackets with parenthesis
	errors = replaceBrackets(errors);

	return errors;
};

const etToast = (cmp, title, message, mode = "dismissable", variant = "success") => {
	if (variant !== "success") {
		console.log(`etToast called for ${variant}: ${message}`);
	}
	let messageParsed = replaceBrackets(message);
	if (window.LWC_Demo.LWC_ShowToastEvent) {
		const toast = new window.LWC_Demo.LWC_ShowToastEvent({
			title,
			mode, // dismissable (can be closed), sticky (must be closed), pester (can NOT be closed)
			message: messageParsed,
			variant // info, success, warning, error
		});
		cmp.dispatchEvent(toast);
	} else if (window.LWC_Demo.toastify) {
		const toast = window.LWC_Demo.toastify({
			text: `<b>${title}</b><br/>${message}`,
			duration: mode === 'sticky' ? -1 : 3000,
			close: mode !== 'pester',
			gravity: "top",
			position: "center",
			className: "etUtils-toastify-js",
			backgroundColor: {
				info: "#706e6b",
				success: "#04844b",
				warning: "#ffb75d",
				error: "#c23934"
			}[variant],
			stopOnFocus: true
		});
		toast.showToast();
		if (mode !== 'pester') {
			// eslint-disable-next-line @lwc/lwc/no-document-query
			let cmpToasts = document.querySelectorAll(".etUtils-toastify-js");
			cmpToasts.forEach(cmpToast => {
				cmpToast.onclick = () => {
					cmpToast.parentNode.removeChild(cmpToast);
				};
			});
		}
	} else {
		alert("Toast failed!");
	}
};

const etToast2 = (cmp, { title, message, mode, variant } = {}) => {
	if (!message) message = "";
	if (!title) title = "title";
	if (!mode) mode = "dismissable";
	if (!variant) variant = "success";
	etToast(cmp, title, message, mode, variant);
}

const etReport = (cmp, errorMsg, title = "An Error Has Occurred", data = null) => {
	etToast(cmp, title, errorMsg, "sticky", "error");
	console.error(`❌  - ${errorMsg}`, data);
};

const etReport2 = (cmp, { title, message, data }) => {
	if (!data) data = null;
	if (!message) message = "";
	if (!title) title = "An Error Has Occurred";
	etReport(cmp, message, title, data);
}

const etToastTest = (cmp) => {
	// etToast(cmp, "STICKY", "INFO", "sticky", "info");
	// etToast(cmp, "STICKY", "SUCCESS", "sticky", "success");
	// etToast(cmp, "STICKY", "WARNING", "sticky", "warning");
	// etToast(cmp, "STICKY", "ERROR", "sticky", "error");

	etToast(cmp, "DISMISSABLE", "INFO", "dismissable", "info");
	etToast(cmp, "STICKY", "SUCCESS", "sticky", "success");
	etToast(cmp, "PESTER", "WARNING", "pester", "warning");
};

const etSort = (list, field, isAsc) => {
	let output = [...list];
	output.sort((a, b) => {
		let valA = a[field];
		let valB = b[field];
		let order = valA < valB ? -1 : 1;
		if (isAsc) return order;
		return -order;
	});
	return output;
};

const etSortPrimitives = (list, isAsc) => {
	let output = [];
	list.forEach((element) => {
		output.push({ element });
	});
	output = etSort(output, "element", isAsc);
	return output.map((item) => item.element);
};

let etTimer = { start: null, last: null };
const etLogTime = (message) => {
	let now = new Date();
	let ms = { start: null, last: null };

	if (etTimer.last) {
		ms.last = now - etTimer.last;
	} else {
		ms.last = -1;
	}
	etTimer.last = now;

	if (etTimer.start) {
		ms.start = now - etTimer.start;
	} else {
		ms.start = -1;
		etTimer.start = now;
	}

	console.error(`${ms.start} / ${ms.last}. ${message}`);
	return { ms, message };
};

const etJSON_Primitive = (value) => {
	if (!value) {
		return { done: true, value };
	} else if (typeof value === "string" || value instanceof String) {
		return { done: true, value };
	} else if (typeof value === "number" && isFinite(value)) {
		return { done: true, value };
	} else if (typeof value === "boolean") {
		return { done: true, value };
	} else if (value instanceof Date) {
		return { done: true, value };
	}
	return { done: false, value };
};
const etJSON_Array = (value, ignoreFields) => {
	if (Array.isArray(value)) {
		// eslint-disable-next-line no-use-before-define
		return { done: true, value: value.map((element) => et2JSON(element, ignoreFields)) };
	}
	return { done: false, value };
};
const etJSON_Map = (value, ignoreFields) => {
	if (typeof value === "object" && value instanceof Map) {
		let newMap = new Map();
		for (const [key, element] of value.entries()) {
			// eslint-disable-next-line no-use-before-define
			newMap.set(key, et2JSON(element, ignoreFields));
		}
		return { done: true, value: newMap };
	}
	return { done: false, value };
};
const etJSON_Set = (value, ignoreFields) => {
	if (typeof value === "object" && value.constructor === Set) {
		let newSet = new Set();
		value.forEach((element) => {
			// eslint-disable-next-line no-use-before-define
			newSet.add(et2JSON(element, ignoreFields));
		});
		return { done: true, value: newSet };
	}
	return { done: false, value };
};

// Must be hoisted :-)
var et2JSON = (node, ignoreFields) => {
	let tmp;
	const output = {};

	tmp = etJSON_Primitive(node);
	if (tmp.done) return tmp.value;

	if (ignoreFields) {
		if (!Array.isArray(ignoreFields)) {
			ignoreFields = [ignoreFields];
		}
	} else {
		ignoreFields = [];
	}

	tmp = etJSON_Array(node, ignoreFields);
	if (tmp.done) return tmp.value;

	tmp = etJSON_Map(node, ignoreFields);
	if (tmp.done) return tmp.value;

	tmp = etJSON_Set(node, ignoreFields);
	if (tmp.done) return tmp.value;

	// Assume it's an object with keys
	for (let key in node) {
		// if (Object.prototype.hasOwnProperty.call(node, key)) {
		if (ignoreFields.includes(key)) {
			output[key] = `[Ignored]`;
		} else {
			const value = node[key];
			try {
				// Checks to see if this can be converted...
				tmp = JSON.stringify(value);
				if (value === undefined) {
					output[key] = "[undefined]";
				} else if (value === null) {
					output[key] = "[null]";
				} else {
					tmp = etJSON_Primitive(value);
					if (tmp.done) {
						output[key] = tmp.value;
					} else if (typeof value === "function") {
						output[key] = `[function]`;
					} else if (Array.isArray(value)) {
						output[key] = value.map((element) => et2JSON(element, ignoreFields));
					} else if (typeof value === "object" && value.constructor === Object) {
						// Test it can be done :-)
						try {
							JSON.stringify(value);
							output[key] = et2JSON(value, ignoreFields);
						} catch (ex) {
							// Nothing
						}
					}
					if (!output[key]) {
						output[key] = JSON.parse(JSON.stringify(value, null, 2));
					}
				}
			} catch (ex) {
				output[key] = ex.message;
			}
		}
		// }
	}

	return output;
};

const etLog = (obj, label) => {
	console.log(`ETLOG: ${label ? label : ""}`, et2JSON(obj));
};

// Call this: await etDelay(1000);
const etDelay = (delay) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), delay);
	});
};

// Call this: await etFlushPromises();
const etFlushPromises = () => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, 0);
	});
};

let audioCtx = null;
const playTone = async ({ cmp, volume, duration, frequency, callback }) => {
	// Duration of the tone in milliseconds
	// Frequency of the tone in hertz
	// Volume of the tone. Default is 1, off is 0.
	// Type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
	// https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode
	// https://developer.mozilla.org/en-US/docs/Web/API/GainNode

	let mute = false; // So I do not wake up my family ;-)
	if (mute) {
		etToast(cmp, 'warning', "To avoid playing sound and waking up my family, I will omit playing noise. But, if my family was awake, the sound would be playing now!");
	} else {

		let type = "sine";
		if (!audioCtx) {
			//if you have another AudioContext class use that one, as some browsers have a limit
			audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);
		}

		let oscillator = audioCtx.createOscillator();
		let gainNode = audioCtx.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioCtx.destination);

		if (type) { oscillator.type = type; }
		if (volume) { gainNode.gain.value = volume; }
		if (callback) { oscillator.onended = callback; }
		if (frequency) { oscillator.frequency.value = frequency; }

		oscillator.start(audioCtx.currentTime);
		oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
	}
}

const beep = (cmp, callback) => {
	let volume = 1;
	let duration = 300;
	let frequency = 1000;

	playTone({ cmp, volume, duration, frequency, callback });
}

// Sample options: {method: "POST", body}
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
const _etAPI = async (cmp, url, options) => {
	let data = {};
	try {
		let response = await fetch(url, options);
		data = { isValid: false, code: response.status }
		if (response.status === 200) {
			data.isValid = true;
			data.json = await response.json();
		} else if (response.status === 418) {
			data.message = await response.json();
			data.message = data.message.text;
			etReport2(cmp, { title: "Error from server", message: data.message, data });
		} else {
			console.error(await response.text());
			throw new Error(`Invalid response from server. HTTP Code ${response.status}`);
		}
	} catch (ex) {
		etReport2(cmp, { title: "Failed to connect to API Server", data: ex });
	}
	return data;
}

const etFetch = async (cmp, url) => {
	let data = await _etAPI(cmp, url, null);
	return data;
}

const etPost = async (cmp, url, body) => {
	let data = await _etAPI(cmp, url, {
		method: "POST",
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	});
	return data;
}

export { etErrorsToString, etToast, etToast2, etToastTest, etReport, etReport2, etSort, etSortPrimitives, etTimer, etLogTime, et2JSON, etLog, etFlushPromises, etDelay, beep, playTone, etFetch, etPost };