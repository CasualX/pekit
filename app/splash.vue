<!--
The splash screen, hides loading pelite wasm.
-->

<script>
"use strict"

Vue.component('app-splash', {
	'data': function() {
		return {
			pelite: peliteStore.state,
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
		<p v-if="pelite.error">Loading PeLite WASM...<span class="app-splash__error"> {{ pelite.reason }}</span></p>
	</article>
</template>

<style>
.app-splash__error {
	color: red;
}
</style>
