"use strict"

let render = {};

//----------------------------------------------------------------
// Renders an arbitrary tag with its textContent set to the given text.

render.text = function(tag, text) {
	let el = document.createElement(tag);
	el.textContent = text;
	return el;
}

//----------------------------------------------------------------
// Renders an object's properties in a table layout.

render.struct = function(obj) {
	let table = document.createElement('table');

	let tr_head = document.createElement('tr');
	tr_head.appendChild(render.text('th', "Member"));
	tr_head.appendChild(render.text('th', "Value"));
	table.appendChild(tr_head);

	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			let tr = document.createElement('tr');
			let td_key = render.text('td', key);
			let td_value = render.text('td', obj[key]);
			tr.appendChild(td_key);
			tr.appendChild(td_value);
			table.appendChild(tr);
		}
	}

	return table;
}

//----------------------------------------------------------------
// Renders an array of objects in a table layout.

render.array = function(array) {
	let table = document.createElement('table');

	// Early reject empty inputs
	if (array.length <= 0) {
		return table;
	}

	// Build the table heading
	let tr_head = document.createElement('tr');
	table.appendChild(tr_head);
	for (var key in array[0]) {
		if (array[0].hasOwnProperty(key)) {
			tr_head.appendChild(render.text('th', key));
		}
	}

	// Build the table entries
	for (var i = 0; i < array.length; ++i) {
		var tr_row = document.createElement('tr');
		table.appendChild(tr_row);
		for (var key in array[i]) {
			if (array[i].hasOwnProperty(key)) {
				tr_row.appendChild(render.text('td', array[i][key]));
			}
		}
	}

	return table;
};

//----------------------------------------------------------------
// Renders the PE headers.

render.headers = function(data) {
	let section = document.createElement('section');

	// DOS header
	section.appendChild(render.text('h2', "DOS header"));
	if (data.dos_header) {
		section.appendChild(render.struct(data.dos_header));
	}

	// NT headers

	// File header
	section.appendChild(render.text('h2', "File header"));
	if (data.nt_headers.FileHeader) {
		section.appendChild(render.struct(data.nt_headers.FileHeader));
	}

	// Optional header
	section.appendChild(render.text('h2', "Optional header"));
	if (data.nt_headers.OptionalHeader) {
		section.appendChild(render.struct(data.nt_headers.OptionalHeader));
	}

	// Data directories
	section.appendChild(render.text('h2', "Data directory"));
	if (data.data_directory) {
		section.appendChild(render.array(data.data_directory));
	}

	// Section headers
	section.appendChild(render.text('h2', "Section headers"));
	if (data.section_headers) {
		section.appendChild(render.array(data.section_headers));
	}

	return section;
};

// function load_exports(section, data) {
// 	load_struct(section.querySelector("#exports_image"), data.Ok.image);
// 	section.querySelector("#exports_dllname").textContent = data.Ok.dll_name.Ok;
// 	section.querySelector("#exports_version").textContent = data.Ok.version;
// 	section.querySelector("#exports_ordinal_base").textContent = data.Ok.ordinal_base;
// }
