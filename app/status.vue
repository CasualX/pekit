
<script>
"use strict"

Vue.component('app-status', {
	data: function() {
		return {
			pekit: this.$root.$data.pekit,
		};
	},
	template: '#app-status',
});
</script>

<template id="app-status">
	<div class="app-status">{{ pekit.statusMessage }}</div>
</template>

<style>
.app-status {
	background-color: #007acd;
	color: #fff;
	line-height: 2em;
	padding-left: 1em;
}
</style>
