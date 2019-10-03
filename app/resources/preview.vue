
<script>
"use strict"

class ResourcesPreview {
	constructor(options) {
		this.path = options ? options.path || "" : "";
	}
}
ResourcesPreview.COMPONENT_NAME = 'resources-preview';

Vue.component('resources-preview', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
			dataEntry: null,
			dataBytes: null,
			error: null,
			viewer: 'utf-8',
		};
	},
	props: {
		instance: ResourcesPreview,
	},
	computed: {
		previewHexDump: function() {
			let hex = "";
			if (this.dataBytes) {
				for (let i = 0; i < this.dataBytes.length; ++i) {
					hex += this.dataBytes[i].toString(16).padStart(2, '0');
				}
			}
			return hex;
		},
		previewUtf8: function() {
			if (!this.dataBytes) {
				return "";
			}
			return new TextDecoder('utf-8').decode(this.dataBytes);
		},
	},
	watch: {
		instance: {
			path: function(newPath, oldPath) {
				this.loadPreview();
			},
		},
	},
	methods: {
		hex: hex,
		loadPreview: function() {
			this.error = null;
			this.dataEntry = null;
			this.dataBytes = null;
			try {
				this.dataEntry = this.pefile.resourcesFindData(this.instance.path);
				if (this.dataEntry) {
					this.dataBytes = this.pefile.resourcesReadData(this.dataEntry);
				}
			}
			catch (ex) {
				this.error = ex;
			}
		},
		setViewer: function(value) {
			this.viewer = value;
		},
	},
	mounted: function() {
		this.loadPreview();
	},
	template: '#resources-preview',
});
</script>

<template id="resources-preview">
	<article class="resources-preview">
		<div>
			<label>Path:</label><input type="text" v-model="instance.path" @keyup.enter="loadPreview">
			<label>Viewer:</label><select @input="setViewer($event.target.value)"><option value="utf-8">UTF-8</option><option value="hexdump">Hexdump</option></select>
		</div>
		<p v-if="error">{{ error }}</p>
		<p v-else-if="!dataBytes">File not found.</p>
		<template v-if="dataEntry">
			<h3>Data Entry</h4>
			<table v-if="dataEntry" class="entries">
				<tr><th class="text">Address</th><td class="number">{{ hex(dataEntry.address) }}</td></tr>
				<tr><th class="text">Size</th><td class="number">{{ hex(dataEntry.size) }}</td></tr>
				<tr><th class="text">CodePage</th><td class="number">{{ hex(dataEntry.code_page) }}</td></tr>
			</table>
			<template v-if="dataBytes">
				<h3>Preview</h3>
				<textarea v-if="viewer == 'utf-8'" readonly="readonly">{{ previewUtf8 }}</textarea>
				<textarea v-if="viewer == 'hexdump'" readonly="readonly">{{ previewHexDump }}</textarea>
			</template>
		</template>
	</article>
</template>

<style>
.resources-preview > textarea {
	word-wrap: break-all;
	resize: vertical;
	width: 100%;
}
</style>
