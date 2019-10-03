
<script>
"use strict"

Vue.component('dock-main', {
	data: function() {
		return {
			uistate: this.$root.$data.uistate,
		};
	},
	template: '#dock-main',
});
</script>

<template id="dock-main">
	<div class="dock-main">
		<dock-sidebar></dock-sidebar>
		<component v-for="{page, instance} in uistate.pageInstances" :key="instance.key" :is="page.component" :instance="instance"></component>
	</div>
</template>

<style>
.dock-main {
	display: grid;
	grid-template: auto / 10rem auto;
}
.dock-main > article {
	padding: 0 1rem;
	overflow-y: scroll;
	overflow-x: auto;
	display: none;
}
.dock-main > article:last-child {
	display: block;
}
</style>
