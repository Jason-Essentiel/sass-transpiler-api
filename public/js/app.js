/**
 * Simulate a key event.
 * @param { HTMLElement } element
 * @param { Number|string } code The keyCode of the key to simulate
 * @param { String } type (optional) The type of event : down, up or press. The default is down
 * @param { Object|undefined } modifiers (optional) An object which contains modifiers keys { ctrlKey: true, altKey: false, ...}
 */
function simulateKey (element, code, type, modifiers) {
	const evtName = (typeof(type) === "string") ? "key" + type : "keydown";
	const modifier = (typeof(modifiers) === "object") ? modifiers : {
		code: code,
		key: code,
		composed: true,
		currentTarget: element
	};

	const event = document.createEvent("KeyboardEvent");
	event.initEvent(evtName, true, true);
	// event.initTextEvent(evtName, true, false, window, "", 6, navigator.language)

	for (let i in modifiers)
		event[i] = modifiers[i];

	console.info('EVENT:', event);
	document.dispatchEvent(event);
}

function indentDown(event) {
	event.preventDefault();
	event.target.focus();

}
function indentUp(event) {
	event.preventDefault();
	event.target.focus();
	document.execCommand('insertText', false, '\t');
	// simulateKey(9, 'press', undefined);
}

window.addEventListener("load", onLoadEvent => {
	let content    = "";
	const sassArea = document.getElementById('sass').querySelector('textarea');
	const cssArea  = document.getElementById('css').querySelector('textarea');
	let timer;

	async function onSassAreaChange(textarea) {
		const {value} = textarea;
		if (value !== content) {
			content                = value;
			const url = `${window.location.protocol}//${window.location.host}/transpile/sass`;
			const transpileRequest = await axios.post(url, {
				sass: value,
				to: "css"
			});
			const response = JSON.parse(transpileRequest.data);
			const { css } = response;
			cssArea.value = css;
		}
	}
	
	sassArea.addEventListener('change', e => onSassAreaChange(e.target));
	sassArea.addEventListener('keypress', e => console.info('keypress:', e));
	sassArea.addEventListener('keydown', e => {
		switch (e.code) {
			case "Tab":
				e.preventDefault();
				sassArea.focus();
				if (e.shiftKey)
					indentDown(e);
					// document.execCommand('', false, '\t');
				else
					indentUp(e);
				break;
			default:
				break;
		}
	});

	timer = setInterval(() => onSassAreaChange(sassArea), 100);
});
