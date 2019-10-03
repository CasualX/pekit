
<script>
"use strict"

class PeKitStore {
	constructor() {
		this.fileReader = new FileReader();
		this.pefile = null;
		this.filename = null;
		this.statusMessage = "";
		this.statusError = null;
		window.pekit = this;
	}
	readFile(file) {
		// If any file was already loading, abort it
		if (this.fileReader.state == FileReader.LOADING) {
			this.fileReader.abort();
		}
		this.pefile = null;
		this.filename = file.name;
		this.statusMessage = "Loading " + file.name + "...";
		this.fileReader.onload = () => {
			this.statusMessage = "Loaded " + file.name;
			this.loadFile(this.fileReader.result, file.name);
		};
		this.fileReader.onerror = reason => {
			this.statusMessage = "Error " + file.name + "!";
			this.statusError = Object.freeze(reason);
		};
		this.fileReader.readAsArrayBuffer(file);
	}
	loadFile(buffer, filename) {
		let pefile = Object.freeze(peliteStore.instance.PeFile.fromBuffer(buffer));
		try {
			let _ = pefile.headers();
			this.pefile = pefile;
			window.pefile = this.pefile;
			this.filename = filename;
		}
		catch (ex) {
			this.statusMessage = "Error " + filename + "!";
			this.statusError = ex;
		}
	}
	loadingFile() {
		return this.fileReader.state == FileReader.LOADING;
	}
	hasFile() {
		return this.pefile !== null;
	}
	closeFile() {
		this.pefile = null;
		this.filename = null;
	}
}
</script>
