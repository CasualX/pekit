
<link rel="component" href="components/overview.vue" dynamic>
<link rel="component" href="components/dosheader.vue" dynamic>
<link rel="component" href="components/ntheaders.vue" dynamic>
<link rel="component" href="components/sections.vue" dynamic>
<link rel="component" href="components/richstructure.vue" dynamic>
<link rel="component" href="components/exports.vue" dynamic>
<link rel="component" href="components/imports.vue" dynamic>
<link rel="component" href="resources/resources.vue" dynamic>
<link rel="component" href="resources/versioninfo.vue" dynamic>
<link rel="component" href="resources/manifest.vue" dynamic>
<link rel="component" href="components/scanner.vue" dynamic>

<script>
"use strict"

function page(title, component, load, bindings = {}) {
	return {
		title,
		component: Vue.markRaw(component),
		load,
		bindings: Object.freeze(bindings),
		resolved: false,
		result: null,
	};
}

function group(title, pages) {
	return { title, pages };
}

function createPages(pefile, parsedHeaders) {
	const pefileBinding = Object.freeze({ pefile });
	return [
		group("Headers", [
			page("Overview", AppOverview, () => parsedHeaders),
			page("DOS Header", AppDosHeader, () => pefile.dosHeader()),
			page("NT Headers", AppNtHeaders, () => parsedHeaders),
			page("Section Headers", AppSections, () => parsedHeaders),
			page("Rich Structure", AppRichStructure, () => pefile.richStructure()),
			page("Exports", AppExports, () => pefile.exports()),
			page("Imports", AppImports, () => pefile.imports()),
		]),
		group("Resources", [
			page("Resources", PeResources, () => pefile.resourcesTree(), pefileBinding),
			page("Version Info", ResourcesVersionInfo, () => pefile.resourcesVersionInfo()),
			page("Manifest", ResourcesManifest, () => pefile.resourcesManifest()),
		]),
		group("Analysis", [
			page("Scanner", AppScanner, () => {
				const sections = pefile.sectionHeaders();
				if (sections instanceof Error) return sections;
				const optionalHeader = pefile.optionalHeader();
				if (optionalHeader instanceof Error) return optionalHeader;
				return { sections, imageSize: optionalHeader.SizeOfImage };
			}, pefileBinding),
		]),
	];
}

const AppUpload = Vue.defineComponent({
	data: function() {
		return {
			pelite: appState.pelite,
		};
	},
	methods: {
		submit: async function(files) {
			if (files.length != 1) {
				alert("Please submit a single file.");
				return;
			}
			let file = files[0];
			if (await this.pelite.openFile(file)) {
				this.loadFromPeKit();
			}
		},
		loadFromPeKit() {
			appState.pages = createPages(this.pelite.pefile, this.pelite.headers);
		},
	},
	template: '#app-upload',
});
</script>

<template id="app-upload">
	<article class="app-upload" @drop.prevent="submit($event.dataTransfer.files)" @dragover.prevent="">
		<p>PeKit is a web application to inspect <a href="https://en.wikipedia.org/wiki/Portable_Executable">Portable Executable (PE)</a> files. This project is Open Source and available on <a href="https://github.com/CasualX/pekit">GitHub</a>.</p>
		<p>To get started, please submit an executable file:</p>
		<input type="file" accept=".exe,.dll,.sys,.mui" id="sample" @change="submit($event.target.files)" :disabled="pelite.loading">
		<p v-if="pelite.statusError != null">{{ pelite.statusError }}</p>
	</article>
</template>

<style>
.app-upload {
	padding: 0 1em 0 2em;
}
</style>
