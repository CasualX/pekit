<!--
The splash screen, hides loading pelite wasm.
-->

<script>
"use strict"

const AppSplash = Vue.defineComponent({
	'data': function() {
		return {
			pelite: appState.pelite,
		};
	},
	computed: {
		'ready': function() {
			return this.pelite.ready;
		}
	},
	template: '#app-splash',
});
</script>

<template id="app-splash">
	<article class="app-splash">
		<p v-if="pelite.initializationError">Loading PeLite WASM...<span class="app-splash__error"> {{ pelite.initializationError }}</span></p>
	</article>
</template>

<style>
.app-splash__error {
	color: red;
}
</style>
