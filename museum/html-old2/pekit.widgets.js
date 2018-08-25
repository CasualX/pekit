
pekit_widgets = (function() {
	"use strict"

	//----------------------------------------------------------------
	// Create an element by its tag name.

	function el(tag) {
		return document.createElement(tag);
	}

	//----------------------------------------------------------------
	// Create an element with a tag and given text content.

	function text(tag, text) {
		let element = el(tag);
		element.textContent = text;
		return element;
	}

	//----------------------------------------------------------------
	// Create an element with a tag and given text content.

	function folded(header, content) {
		let container = el('div');
		container.classList.add("fold-container");

		let divHeader = el('div');
		divHeader.classList.add("fold-header");
		divHeader.appendChild(header);
		container.appendChild(divHeader);

		let divContent = el('div');
		divContent.classList.add("fold-content");
		for (let i = 0; i < content.length; ++i) {
			divContent.appendChild(content[i]);
		}
		container.appendChild(divContent);

		divHeader.addEventListener('click', function(e) {
			divContent.classList.toggle("folded");
		});

		return container;
	}

	//----------------------------------------------------------------
	// Creates a tr of array of inptus.

	function row(tds) {
		let tr = el('tr');
		for (let i = 0; i < tds.length; ++i) {
			tr.appendChild(tds[i]);
		}
		return tr;
	}

	//----------------------------------------------------------------
	// Creates a table of a struct.

	function struct(struct) {
		let table = el('table');

		table.appendChild(row([
			text('th', "Field"),
			text('th', "Value"),
		]))

		for (let key in struct) {
			if (struct.hasOwnProperty(key)) {
				table.appendChild(row([
					text('td', key),
					text('td', struct[key]),
				]));
			}
		}

		return table;
	}

	//----------------------------------------------------------------
	// Creates a table of an array of structs.

	function list(list) {
		let table = el('table');

		if (!(list.length > 0)) {
			return table;
		}

		let fields = Object.keys(list[0]);
		table.appendChild(row(fields.map(field => text('th', field))));

		for (let i = 0; i < list.length; ++i) {
			let tr = row(fields.map(field => text('td', list[i][field])));
			table.appendChild(tr);
		}

		return table;
	}

	//----------------------------------------------------------------
	// Creates the UI for the PE headers.

	function headers(json) {
		let h = 'h3';
		let dos_header = folded(text(h, "DOS Header"), [struct(json.headers.DosHeader)]);
		let file_header = folded(text(h, "File Header"), [struct(json.headers.NtHeaders.FileHeader)]);
		let optional_header = folded(text(h, "Optional Header"), [struct(json.headers.NtHeaders.OptionalHeader)]);
		let data_directory = folded(text(h, "Data Directory"), [list(json.headers.DataDirectory)]);
		let section_headers = folded(text(h, "Section Headers"), [list(json.headers.SectionHeaders)]);

		let headers = folded(text('h2', "Headers"), [
			dos_header,
			file_header,
			optional_header,
			data_directory,
			section_headers,
		]);

		return headers;
	}

	return {
		headers: headers,
	};
})();
