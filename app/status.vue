
<script>
"use strict"

const AppStatus = Vue.defineComponent({
	data: function() {
		return {
			pelite: appState.pelite,
		};
	},
	template: '#app-status',
});
</script>

<template id="app-status">
	<div class="app-status">{{ pelite.statusMessage }}</div>
</template>

<style>
.app-status {
	background-color: #007acd;
	color: #fff;
	line-height: 2em;
	padding-left: 1em;
}
</style>
