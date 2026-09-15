import createPeLite from "./deps/pelite.js";

"use strict"

/** @typedef {Exclude<Awaited<ReturnType<typeof createPeLite>>, Error>} PeLiteInstance */
/** @typedef {InstanceType<PeLiteInstance["PeFile"]>} PeFileInstance */
/** @typedef {Exclude<ReturnType<PeFileInstance["dosHeader"]>, Error>} PeDosHeader */
/** @typedef {Exclude<ReturnType<PeFileInstance["headers"]>, Error>} PeHeaders */
/** @typedef {Exclude<ReturnType<PeFileInstance["richStructure"]>, Error>} PeRichStructure */
/** @typedef {Exclude<ReturnType<PeFileInstance["exports"]>, Error>} PeExports */
/** @typedef {Exclude<ReturnType<PeFileInstance["imports"]>, Error>} PeImports */
/** @typedef {Exclude<ReturnType<PeFileInstance["resourcesTree"]>, Error>} PeResourcesTree */
/** @typedef {Exclude<ReturnType<PeFileInstance["resourcesVersionInfo"]>, Error>} PeVersionInfo */
/** @typedef {{sections: Exclude<ReturnType<PeFileInstance["sectionHeaders"]>, Error>, imageSize: number}} PeScannerData */

/** @type {PeLiteInstance|null} */
let peliteInstance = null;

const peliteBridge = Vue.reactive({
	ready: false,
	initializationError: /** @type {Error|null} */ (null),
	loading: false,
	pefile: /** @type {PeFileInstance|null} */ (null),
	headers: /** @type {PeHeaders|null} */ (null),
	filename: /** @type {string|null} */ (null),
	statusMessage: "",
	statusError: /** @type {Error|null} */ (null),

	async openFile(file) {
		if (this.loading) return false;
		this.loading = true;
		this.pefile = null;
		this.headers = null;
		this.filename = file.name;
		this.statusMessage = "Loading " + file.name + "...";
		this.statusError = null;
		try {
			const buffer = await file.arrayBuffer();
			if (peliteInstance === null) {
				this.statusError = new Error("PeLite is not ready");
			}
			else {
				const pefile = peliteInstance.PeFile.fromBuffer(buffer);
				if (pefile instanceof Error) {
					this.statusError = pefile;
				}
				else {
					const headers = pefile.headers();
					if (headers instanceof Error) {
						pefile.dispose();
						this.statusError = headers;
					}
					else {
						this.pefile = Vue.markRaw(pefile);
						this.headers = Object.freeze(headers);
						this.statusMessage = "Loaded " + file.name;
						Object.assign(window, { pefile: this.pefile });
						return true;
					}
				}
			}
		}
		catch (reason) {
			this.statusError = reason instanceof Error ? reason : new Error(String(reason));
		}
		finally {
			this.loading = false;
		}
		this.statusMessage = "Error " + file.name + "!";
		return false;
	},

	hasFile() {
		return this.pefile !== null;
	},

	closeFile() {
		if (this.pefile) this.pefile.dispose();
		this.pefile = null;
		this.headers = null;
		this.filename = null;
	},
});

async function initializePelite() {
	const result = await createPeLite("deps/pelite.wasm");
	if (result instanceof Error) {
		peliteBridge.initializationError = result;
		return;
	}
	peliteInstance = result;
	peliteBridge.ready = true;
}

initializePelite().catch(reason => {
	peliteBridge.initializationError = reason instanceof Error ? reason : new Error(String(reason));
});

Object.assign(window, { peliteBridge });
