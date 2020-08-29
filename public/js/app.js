const editorOptions = {
	lineWrapping:   true,
	theme:          'monokai',
	indentUnit:     4,
	tabSize:        4,
	indentWithTabs: false,
	smartIndent:    true,
	extraKeys:      {
		Tab:         (cm) => {
			if (cm.getMode().name === 'null') {
				cm.execCommand('insertTab');
			} else {
				if (cm.somethingSelected()) {
					cm.execCommand('indentMore');
				} else {
					cm.execCommand('insertSoftTab');
				}
			}
		},
		Backspace:   (cm) => {
			if (!cm.somethingSelected()) {
				let cursorsPos    = cm.listSelections().map((selection) => selection.anchor);
				let indentUnit    = cm.options.indentUnit;
				let shouldDelChar = false;
				for (let cursorIndex in cursorsPos) {
					let cursorPos   = cursorsPos[cursorIndex];
					let indentation = cm.getStateAfter(cursorPos.line).indented;
					if (!(indentation !== 0 &&
					      cursorPos.ch <= indentation &&
					      cursorPos.ch % indentUnit === 0)) {
						shouldDelChar = true;
					}
				}
				if (!shouldDelChar) {
					cm.execCommand('indentLess');
				} else {
					cm.execCommand('delCharBefore');
				}
			} else {
				cm.execCommand('delCharBefore');
			}
		},
		'Shift-Tab': (cm) => cm.execCommand('indentLess'),
	},
};

/**
 *
 * @return {[CodeMirror, CodeMirror, jQuery.fn.init|jQuery]}
 */
function initEditors() {
	const sassArea    = $('#sass textarea')[0];
	const cssArea     = $('#css textarea')[0];
	const sassOptions = {
		mode:          "text/x-sass",
		lineNumbers:   true,
		matchBrackets: true,
		...editorOptions,
		extraKeys:     {
			"Ctrl-Space": "autocomplete",
			...editorOptions.extraKeys,
		},
		// hintOptions: {hint: synonyms}
	};
	const sassEditor  = CodeMirror.fromTextArea(sassArea, sassOptions);
	const cssEditor   = CodeMirror.fromTextArea(cssArea, {
		lineNumbers:   true,
		lineWrapping:  true,
		mode:          "text/css",
		matchBrackets: true,
		...editorOptions,
		extraKeys:     {
			"Ctrl-Space": "autocomplete",
			...editorOptions.extraKeys,
		},
		// hintOptions: {hint: synonyms}
	});
	const errorsList  = $('#errors');

	return [sassEditor, cssEditor, errorsList];
}

window.addEventListener("load", onLoadEvent => {
	const $loader = $('#loader');
	$loader.hide();
	const [sassEditor, cssEditor, errorsList] = initEditors();
	let errorsFocused                         = false
	errorsList
		.hover(() => {
			console.info('Errors focused!');
			errorsFocused = true;
		}, () => {
			console.info('Errors unfocused!');
			errorsFocused = false;
		});

	let prevCss = "";

	let timer, timerDelay     = 1000;
	const setTimer            = (editor) => {
		timer = setTimeout(() => askForTranspilation(editor, editor.getValue()), timerDelay);
	}
	const transpile           = async (value) => {
		const url                                = `${window.location.protocol}//${window.location.host}/transpile/sass`;
		const transpileRequest                   = await axios.post(url, {
			sass:    value,
			to:      "css",
			options: editorOptions,
		});
		const response                           = JSON.parse(transpileRequest.data);
		const {css, error, started_at, ended_at} = response;
		console.info(`Sent, transpiled and answered in ${new Date(new Date(ended_at).getTime() * 1000 - new Date(started_at).getTime() * 1000).getMilliseconds()}ms`);
		cssEditor.setValue(css || cssEditor.getValue());
		if (error) {
			const refLi = errorsList.find(':first-child');
			// Using [0] here to clone only the first element of jquery returned array
			const li    = $.clone(refLi[0], true, true);
			// Surrounding with jQuery because we cloned from a DOM element but not a jQuery one
			const $li   = $(li);
			$li.find('h5').text(`Erreur #${errorsList.children().length}`);
			$li.find('small').text(`${new Date().toTimeString()}`);
			$li.find('p').text(error);
			// Same here, using [0] to insert only after the first DOM element in the jQuery find results
			$li.insertAfter(refLi[0]);
			if (errorsFocused === false)
				errorsList.stop().animate({scrollTop: 0}, 500);
			else
				console.info('errors focused!');
		}
		$loader.hide();
	};
	const askForTranspilation = async (editor, value) => {
		if (value.length === 0) return;
		transpile(value);
	}
	const onSassChange        = (editor) => {
		$loader.hide();
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}
		const value = editor.getValue();
		if (value.length === 0) return setTimer(editor);
		if (value === prevCss) return;
		prevCss = value;
		$loader.show();
		setTimer(editor)
	};

	sassEditor.on('change', onSassChange);
});
