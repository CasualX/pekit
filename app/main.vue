<link rel="component" href="header.vue">
<link rel="component" href="status.vue">
<link rel="component" href="pelite.vue.js">
<link rel="component" href="splash.vue" dynamic>
<link rel="component" href="upload.vue" dynamic>
<link rel="component" href="workspace.vue" dynamic>

<script>
"use strict"

const AppMain = Vue.defineComponent({
	data: function() {
		return {
			pelite: appState.pelite,
		};
	},
	computed: {
		componentName: function() {
			if (!this.pelite.ready) {
				return 'app-splash';
			}
			else if (this.pelite.hasFile() && appState.pages !== null) {
				return 'app-workspace';
			}
			else {
				return 'app-upload';
			}
		},
	},
	template: '#app-main',
});

const appState = Vue.reactive({
	pelite: peliteBridge,
	pages: /** @type {any[]|null} */ (null),
});

const app = Vue.createApp({
	data() {
		return appState;
	},
});

Object.entries({
	'app-main': AppMain,
	'app-header': AppHeader,
	'app-status': AppStatus,
	'app-splash': AppSplash,
	'app-upload': AppUpload,
	'app-workspace': AppWorkspace,
	'app-overview': AppOverview,
	'app-dosheader': AppDosHeader,
	'app-ntheaders': AppNtHeaders,
	'app-sections': AppSections,
	'app-richstructure': AppRichStructure,
	'app-exports': AppExports,
	'app-imports': AppImports,
	'page-result': PageResult,
	'pe-resources': PeResources,
	'resources-hexed': ResourcesHexed,
	'resources-versioninfo': ResourcesVersionInfo,
	'resources-manifest': ResourcesManifest,
	'app-analysis-scanner': AppScanner,
}).forEach(([name, component]) => app.component(name, component));

app.config.errorHandler = (error, instance, info) => {
	console.error(`Vue error in ${info}`, error, instance);
};

app.mount('#app');
</script>

<template id="app-main">
	<div class="app-main">
		<app-header></app-header>
		<component :is="componentName"></component>
		<app-status></app-status>
	</div>
</template>

<style>
html, body, #app, .app-main {
	font-family: 'Roboto', 'Segoe UI', 'Verdana', sans-serif;
	overflow: hidden;
	padding: 0;
	margin: 0;
	width: 100%;
	height: 100%;
}
.app-main {
	display: grid;
	grid-template-rows: 3rem calc(100% - 5rem) 2rem;
}

/* article styles */
article {
	overflow: auto;
}
article > h3 {
	border-bottom: darkslategray 1px solid;
}
article > table.entries th, article > table.entries td {
	vertical-align: top;
	font-weight: normal;
	padding: 0.2rem 1rem;
}
article > table.records th, article > table.records td {
	vertical-align: top;
	padding: 0.2rem 1rem;
}
.text {
	font-family: 'Fira Code', 'Iosevka', 'Consolas', 'Courier New', monospace;
	white-space: pre;
	text-align: left;
}
.number {
	font-family: 'Fira Code', 'Iosevka', 'Consolas', 'Courier New', monospace;
	white-space: pre;
	text-align: right;
}
</style>
