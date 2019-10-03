
<script>
"use strict"

class PeResourcesStore {
	constructor(options) {}
}
PeResourcesStore.COMPONENT_NAME = 'pe-resources';

Vue.component('pe-resources', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
			viewer: 'info',
			preview: null,
			opened: {},
		};
	},
	props: {
		instance: PeResourcesStore,
	},
	computed: {
		error: function() {
			try {
				let _ = this.pefile.resourcesTree();
				return null;
			}
			catch (ex) {
				return ex;
			}
		},
		resourcesTree: function() {
			return this.pefile.resourcesTree();
		},
		resources: function() {
			let N = name => (typeof name == "number" ? "#" : "") + name;
			let tree = this.resourcesTree;
			let opened = this.opened;
			return tree.map(entry => {
				if ('data' in entry) {
					return { name: N(entry.name), data: entry.data, path: '/' + N(entry.name) };
				}
				if ('directory' in entry) {
					let children = [];
					(function flatten(prefixes, directory) {
						directory.forEach(child => {
							let components = [...prefixes, N(child.name)];
							let name = components.join(" : ");
							let path = '/' + N(entry.name) + '/' + components.join('/');
							if ('data' in child) {
								children.push({ name: name, data: child.data, path: path });
							}
							else if ('directory' in child) {
								flatten(components, child.directory);
							}
						});
					})([], entry.directory);
					return { name: N(entry.name), directory: children, path: '/' + N(entry.name) };
				}
				return entry;
			});
		},
		previewAsBytes: function() {
			try {
				return this.pefile.resourcesReadData(this.preview.data);
			}
			catch (ex) {
				return new Uint8Array();
			}
		},
		previewAsHex: function() {
			return this.confirm() ? this.previewAsBytes : new Uint8Array();
		},
		previewAsText: function() {
			return this.confirm() ? new TextDecoder('utf-8').decode(this.previewAsBytes) : "";
		},
		previewAsUnicode: function() {
			return this.confirm() ? new TextDecoder('utf-16le').decode(this.previewAsBytes) : "";
		},
		previewAsBlob: function() {
			return new Blob([this.previewAsBytes]);
		},
		previewAsURL: function() {
			if (this.previewURL) {
				URL.revokeObjectURL(this.previewURL);
				this.previewURL = null;
			}
			this.previewURL = URL.createObjectURL(this.previewAsBlob);
			return this.previewURL;
		},
	},
	methods: {
		hex: hex,
		chooseIcon: function(entry) {
			if ('data' in entry) {
				return 'icon-blank';
			}
			else if ('directory' in entry) {
				return this.opened[entry.path] ? 'icon-dir-opened' : 'icon-dir-closed';
			}
		},
		clickEntry: function(entry) {
			if ('data' in entry) {
				this.preview = entry;
			}
			else if ('directory' in entry) {
				Vue.set(this.opened, entry.path, !this.opened[entry.path]);
			}
		},
		confirm: function() {
			if (this.preview.data.size > 0x4000) {
				if (!window.confirm("This resource's size is " + Math.round(this.preview.data.size / 1024) + " KiB.\nSuch large resources can take your browser time to display.\nAre you sure you want to preview?")) {
					this.viewer = 'info';
					return false;
				}
			}
			return true;
		},
		saveAs: function() {
			saveAs(this.previewAsBlob);
		},
	},
	template: '#pe-resources',
});
</script>

<template id="pe-resources">
	<article class="pe-resources">
		<template v-if="error">
			<p>There was an error reading the Resources:</p>
			<p>{{ error }}</p>
		</template>
		<template v-else-if="!resourcesTree">
			<p>There are no Resources.</p>
		</template>
		<template v-else>
			<h3>Resources</h3>
			<section>
				<div class="resources-tree__ls">
					<ul class="select--none">
						<li v-for="entry in resources" :class="['icon', chooseIcon(entry)]">
							<label @click="clickEntry(entry)">{{ entry.name }}</label>
							<ul v-if="opened[entry.path]">
								<li v-for="data in entry.directory" :class="['icon', chooseIcon(data)]">
									<label :class="{ selected: preview && preview.path == data.path, unselected: !(preview && preview.path == data.path) }" @click="clickEntry(data)">{{ data.name }}</label>
								</li>
							</ul>
						</li>
					</ul>
				</div>
				<div v-if="preview" class="resources-tree__preview">
					<div class="w3stab select--none">
						<button @click="viewer = 'info'" :class="{ active: viewer == 'info' }">Info</button>
						<button @click="viewer = 'hex'" :class="{ active: viewer == 'hex' }">Hex</button>
						<button @click="viewer = 'text'" :class="{ active: viewer == 'text' }">Text</button>
						<button @click="viewer = 'unicode'" :class="{ active: viewer == 'unicode' }">Unicode</button>
						<button @click="viewer = 'image'" :class="{ active: viewer == 'image' }">Image</button>
						<button @click="saveAs()">Download</button>
					</div>
					<div class="w3stabcontent">
						<table v-if="viewer == 'info'" class="entries">
							<tr><th class="text">Path</th><td class="text">{{ preview.path }}</td></tr>
							<tr><th class="text">Address</th><td class="number">{{ hex(preview.data.address) }}</td></tr>
							<tr><th class="text">Size</th><td class="number">{{ hex(preview.data.size) }}</td></tr>
							<tr><th class="text">CodePage</th><td class="number">{{ hex(preview.data.code_page) }}</td></tr>
						</table>
						<resources-hexed v-if="viewer == 'hex'" :data="previewAsHex"></resources-hexed>
						<textarea v-if="viewer == 'text'" rows="24">{{ previewAsText }}</textarea>
						<textarea v-if="viewer == 'unicode'" rows="24">{{ previewAsUnicode }}</textarea>
						<img v-if="viewer == 'image'" :src="previewAsURL">
					</div>
				</div>
			</section>
		</template>
	</article>
</template>

<style>
.pe-resources > section {
	display: grid;
	overflow: hidden;
	grid-template: auto / 15rem auto;
}

.resources-tree__ls ul {
	margin: 0;
	padding: 0;
	list-style-type: none;
}
.resources-tree__ls label {
	cursor: pointer;
}
.resources-tree__ls label.selected {
	background-color: #316ac5;
	color: #ffffff;
	border: 1px dotted #ce953a;
	padding: 0 0.3rem;
}
.resources-tree__ls label.unselected {
	padding: 0 0.3rem;
}
.resources-tree__ls .icon {
	background-size: 16px 16px;
	background-repeat: no-repeat;
	background-position: left 2px;
	padding-left: 20px;
}
.resources-tree__ls .icon.icon-dir-opened {
	background-image: url('img/icons8-opened-folder-50.png');
}
.resources-tree__ls .icon.icon-dir-closed {
	background-image: url('img/icons8-folder-50.png');
}
.resources-tree__ls .icon.icon-blank {
	background-image: url('img/icons8-file-24.png');
}

.resources-tree__preview {
	display: grid;
	grid-template: 2rem auto / auto;
}
.resources-tree__preview textarea {
	width: 100%;
	resize: vertical;
}
</style>
