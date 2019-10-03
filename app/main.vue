
<script>
"use strict"

Vue.component('app-main', {
	data: function() {
		return {
			pelite: peliteStore.state,
			pekit: this.$root.$data.pekit,
		};
	},
	computed: {
		componentName: function() {
			if (!this.pelite.ready) {
				return 'app-splash';
			}
			else if (this.pekit.hasFile()) {
				return 'dock-main';
			}
			else {
				return 'app-upload';
			}
		},
	},
	template: '#app-main',
});
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
