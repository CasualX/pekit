
<script>
"use strict"

Vue.component('app-upload', {
	data: function() {
		return {
			pekit: this.$root.$data.pekit,
		};
	},
	methods: {
		submit: function(files) {
			if (files.length != 1) {
				alert("Please submit a single file.");
				return;
			}
			let file = files[0];
			this.pekit.readFile(file);
			this.loadFromPeKit();
		},
		loadFromPeKit() {
			let headers = new UIGroupStore("Headers", [
				new UIPageStore("Overview", AppOverviewStore),
				new UIPageStore("DOS Header", AppDosHeaderStore),
				new UIPageStore("NT Headers", AppNtHeadersStore),
				new UIPageStore("Section Headers", AppSectionsStore),
				new UIPageStore("Rich Structure", AppRichStructureStore),
				new UIPageStore("Exports", AppExportsStore),
				new UIPageStore("Imports", AppImportsStore),
			]);
			let resources = new UIGroupStore("Resources", [
				new UIPageStore("Resources", PeResourcesStore),
				new UIPageStore("Version Info", ResourcesVersionInfoStore),
				new UIPageStore("Manifest", ResourcesManifestStore),
				// new UIPageStore("Icons"),
			]);
			let analysis = new UIGroupStore("Analysis", [
				new UIPageStore("Scanner", AppScannerStore),
				// new UIPageStore("Strings"),
			]);
			let uistate = new UIStateStore([headers, resources, analysis])
			uistate.open(headers.pages[0], null);
			this.$root.$data.uistate = uistate;
		},
	},
	template: '#app-upload',
});
</script>

<template id="app-upload">
	<article class="app-upload" @drop.prevent="submit($event.dataTransfer.files)" @dragover.prevent="">
		<p>PeKit is a web application to inspect <a href="https://en.wikipedia.org/wiki/Portable_Executable">Portable Executable (PE)</a> files. This project is Open Source and available on <a href="https://github.com/CasualX/pekit">GitHub</a>.</p>
		<p>To get started, please submit an executable file:</p>
		<input type="file" accept=".exe,.dll,.sys,.mui" id="sample" @change="submit($event.target.files)" :disabled="pekit.loadingFile()">
		<p v-if="pekit.statusError != null">{{ pekit.statusError }}</p>
	</article>
</template>

<style>
.app-upload {
	padding: 0 1em 0 2em;
}
</style>
