
function html(tag, string) {
	let root = document.createElement(tag);
	root.innerHTML = string;

	let result = { root };
	for (element of root.querySelectorAll("*[data-id]")) {
		result[element.dataset.id] = element;
		element.classList.add(element.dataset.id);
		delete element.dataset.id;
	}

	return result;
}
function replace(child, html) {
	child.parentNode.replaceChild(html.root, child);
	return html.root;
}

//----------------------------------------------------------------

class PekitService {
	constructor() {
		this.result = null;

		fetch("pekit.wasm")
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => WebAssembly.instantiate(arrayBuffer, {}))
			.then(result => this.init(result));
	}

	init(result) {
		this.result = result;
	}

	parse(bytes) {
		if (!this.result) {
			return { discriminant: PekitService.loading };
		}

		let instance = this.result.instance;

		// Allocate and copy the input bytes
		let ptr = instance.exports.allocate_bytes(bytes.length);
		new Uint8Array(instance.exports.memory.buffer, ptr, bytes.length).set(bytes);

		// Allocate the return string
		let result = instance.exports.string_allocate();

		// Invoke pelite json to_string
		let success = instance.exports.to_string(ptr, bytes.length, result);

		// Extract the resulting string
		let str_data = instance.exports.string_data(result);
		let str_len = instance.exports.string_len(result);
		let str_bytes = new Uint8Array(instance.exports.memory.buffer, str_data, str_len);
		let str = new TextDecoder('utf-8').decode(str_bytes);

		// Cleanup resources
		instance.exports.free_bytes(ptr, bytes.length);
		instance.exports.string_free(result);

		return success ?
			{ discriminant: PekitService.success, json: JSON.parse(str) } :
			{ discriminant: PekitService.error, message: str };
	}
}
PekitService.success = Symbol('success');
PekitService.error = Symbol('error');
PekitService.loading = Symbol('loading');

//----------------------------------------------------------------

class MainView {
	constructor() {
		this.parser = new PekitService();
		this.fileInput = new FileInput();
		this.fileInput.onsubmit = arrayBuffer => {
			this.submit(arrayBuffer);
		};
		this.viewer = new Viewer();
		this.html = html('div', `
			<header data-id="header">
				<h1>PeKit</h1>
			</header>
		`);
		this.html.header.appendChild(this.fileInput.html.root);
		this.html.root.appendChild(this.viewer.html.root);
	}
	submit(arrayBuffer) {
		let result = this.parser.parse(new Uint8Array(arrayBuffer));
		this.viewer.result = result;

		switch (result.discriminant) {
			case PekitService.loading: this.fileInput.message = "Failed to load PeKit wasm, try again later."; break;
			case PekitService.error: this.fileInput.message = "Error: " + result.message; break;
			case PekitService.success: this.fileInput.message = "Success."; break;
		}
	}
}

//----------------------------------------------------------------

class FileInput {
	constructor() {
		this.onsubmit = null;

		this.html = html('div', `
			<input type="file" data-id="file">
			<input type="button" value="Submit" data-id="submit">
			<span data-id="message">Please select a file.</span>
			<br>
		`);

		this.html.submit.addEventListener('click', e => this.submit(e));
	}

	submit(e) {
		let files = this.html.file.files;

		if (files.length != 1) {
			this.message = "Please select a file.";
			return;
		}

		if (this.onsubmit) {
			let reader = new FileReader();
			reader.onload = (e) => this.onsubmit(reader.result);
			reader.readAsArrayBuffer(files[0]);
		}
	}

	set message(value) {
		this.html.message.textContent = value;
	}
}

//----------------------------------------------------------------

class Viewer {
	constructor() {
		let classes = [OutputView, HeadersView, ImportsView, ExportsView];
		this.pages = classes.map(class_fn => new class_fn());
		this.current = null;

		this.html = html('div', `
			<ul data-id="index">
				${this.pages.map(page => `<li class="button" data-id="${page.caption}"><h2>${page.caption}</h2></li>`).join('')}
			</ul>
			<div data-id="content"></div>
		`);
		this.html.root.id = "Viewer";

		// Make the index interactive
		this.pages.forEach(page => {
			page.html.root.id = page.caption;
			this.html[page.caption].addEventListener('click', e => this.select(page.caption));
		});

		// Select the first page to open
		this.select(null);
		this.result = null;
	}

	select(caption) {
		let current = this.current;
		this.pages.forEach(page => {
			// Update the index
			if (page.caption == caption) {
				this.html[page.caption].classList.add('current');
			}
			else {
				this.html[page.caption].classList.remove('current');
			}
			// Update the content
			if (current == page) {
				this.html.content.removeChild(page.html.root);
			}
			if (page.caption == caption) {
				this.current = page;
				this.html.content.appendChild(page.html.root);
			}
		});
	}

	set result(result) {
		if (result && result.discriminant == PekitService.success) {
			this.html.root.style.display = 'block';
			this.pages.forEach(page => page.data = result.json);
		}
		else {
			this.html.root.style.display = 'none';
		}
	}
}

//----------------------------------------------------------------

class OutputView {
	get caption() {
		return OutputView.caption;
	}

	constructor() {
		this.html = html('article', `
			<textarea data-id="json"></textarea>
		`);
	}

	set data(data) {
		this.html.json.value = JSON.stringify(data);
	}
}
OutputView.caption = "Output";

//----------------------------------------------------------------

class HeadersView {
	get caption() {
		return HeadersView.caption;
	}

	constructor() {
		this.html = html('article', `
			<div class="fileHeader">
				<h3>File Header</h3>
				<table data-id="fileHeader"></table>
			</div>
			<div class="optionalHeader">
				<h3>Optional Header</h3>
				<table data-id="optionalHeader"></table>
			</div>
			<div class="dataDirectory">
				<h3>Data Directory</h3>
				<table data-id="dataDirectory"></table>
			</div>
			<div class="sectionHeaders">
				<h3>Section Headers</h3>
				<table data-id="sectionHeaders"></table>
			</div>
		`);
	}

	set fileHeader(fileHeader) {
		this.html.fileHeader = replace(this.html.fileHeader, html('table', `
			<tr><th>Property</th><th>Value</th></tr>
			${
				Object.entries(fileHeader).map(([name, value]) => `
					<tr>
						<td>${name}</td><td class="hex">${value.toString(16)}</td>
					</tr>
				`).join('')
			}
		`));
	}
	set optionalHeader(optionalHeader) {
		this.html.optionalHeader = replace(this.html.optionalHeader, html('table', `
			<tr><th>Property</th><th>Value</th></tr>
			${
				Object.entries(optionalHeader).map(([name, value]) => `
					<tr>
						<td>${name}</td><td class="hex">${value.toString(16)}</td>
					</tr>
				`).join('')
			}
		`));
	}
	set dataDirectory(dataDirectory) {
		if (dataDirectory == null || dataDirectory.length <= 0) {
			this.html.dataDirectory = replace(this.html.dataDirectory, html('p', `empty`));
		}
		else {
			let dataDirKeys = Object.keys(dataDirectory[0]);
			this.html.dataDirectory = replace(this.html.dataDirectory, html('table', `
				<tr>
					${dataDirKeys.map(key => `<th>${key}</th>`).join('')}
				</tr>
				${
					dataDirectory.map(row => `
						<tr>
							${dataDirKeys.map(key => `
								<td class="hex">${row[key].toString(16)}</td>
							`).join('')}
						</tr>
					`).join('')
				}
			`));
		}
	}
	set sectionHeaders(sectionHeaders) {
		if (sectionHeaders == null || sectionHeaders.length <= 0) {
			this.html.sectionHeaders = replace(this.html.sectionHeaders, html('p', `empty`));
		}
		else {
			let sectionKeys = ["Name", "VirtualAddress", "VirtualSize", "PointerToRawData", "SizeOfRawData", "Characteristics"];
			this.html.sectionHeaders = replace(this.html.sectionHeaders, html('table', `
				<tr>
					${sectionKeys.map(key => `<th>${key}</th>`).join('')}
				</tr>
				${
					sectionHeaders.map(row => `
						<tr>
							${sectionKeys.map(key => `
								<td class="hex">${row[key].toString(16)}</td>
							`).join('')}
						</tr>
					`).join('')
				}
			`));
		}
	}

	set data(data) {
		this.fileHeader = data.headers.NtHeaders.FileHeader;
		this.optionalHeader = data.headers.NtHeaders.OptionalHeader;
		this.dataDirectory = data.headers.DataDirectory;
		this.sectionHeaders = data.headers.SectionHeaders;
	}
}
HeadersView.caption = "Headers";

//----------------------------------------------------------------

class ImportsView {
	get caption() {
		return ImportsView.caption;
	}

	constructor() {
		this.html = html('article', `<div data-id="index"></div><div data-id="details"></div>`);
	}

	set data(data) {
		this.html.index = replace(this.html.index, html('div',
			data.imports.map(desc => `
				<div>
					<h3>${desc.dll_name}</h3>
					<p>${desc.int.length} imports</p>
				</div>
			`).join('')
		));
		this.html.index.classList.add('index');
		this.html.details = replace(this.html.details, html('div',
			data.imports.map(desc => `
				<div>
					<div class="overview">
						<h3>${desc.dll_name}</h3>
						<p>${desc.int.length} imports</p>
					</div>
					<table>
						<tr><th>Hint</th><th>Name</th></tr>
						${
							desc.int.map(imp => imp.ByName ? `
								<tr class="ByName"><td>${imp.ByName.hint}</td><td class="symbol">${imp.ByName.name}</td></tr>
							` : imp.ByOrdinal ? `
								<tr class="ByOrdinal"><td>ord</td><td class="symbol">${imp.ByOrdinal.ord}</td></tr>
							` : ``).join('')
						}
					</table>
				</div>
			`).join('')
		));
		this.html.details.classList.add('details');
	}
}
ImportsView.caption = "Imports";

//----------------------------------------------------------------

class ExportsView {
	get caption() {
		return ExportsView.caption;
	}

	constructor() {
		this.html = html('article', `
			<h3>Dll name</h3>
			<p data-id="dll_name"></p>
			<h3>Timestamp</h3>
			<p data-id="timestamp"></p>
			<h3>Version</h3>
			<p data-id="version"></p>
			<table data-id="symbols"></table>
		`);
	}

	set dllName(value) {
		this.html.dll_name.textContent = value;
	}
	set timestamp(value) {
		this.html.timestamp.textContent = new Date(value * 1000).toString();
		this.html.timestamp.title = "0x" + value.toString(16);
	}
	set version(value) {
		this.html.version.textContent = value;
	}
	set symbols(value) {
		this.html.symbols = replace(this.html.symbols, html('table', `
			<tr><th>Ordinal</th><th>Function</th><th>Names</th></tr>
			${
				value.map(f => `
					<tr>
						<td>${f.ordinal}</td>
						<td class="hex">${f.address}</td>
						<td>${f.names.map(name => `<span class="symbol">${name}</span>`).join()}</td>
					</tr>
				`).join('')
			}
		`));
	}

	set data(data) {
		this.dllName = data.exports.dll_name;
		this.timestamp = data.exports.time_date_stamp;
		this.version = data.exports.version;
		let names = new Array(data.exports.functions.length);
		Object.entries(data.exports.names).forEach(([name, index]) => {
			names[index] = names[index] || [];
			names[index].push(name);
		})
		this.symbols = data.exports.functions.map((address, index) => ({
			address,
			ordinal: data.exports.ordinal_base + index,
			names: names[index],
		}));
	}
}
ExportsView.caption = "Exports";
