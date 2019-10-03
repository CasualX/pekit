<!--

-->

<script>
"use strict"

class AppOverviewStore {
	constructor(options) {}
}
AppOverviewStore.COMPONENT_NAME = 'app-overview';

Vue.component('app-overview', {
	data: function() {
		return {
			pekit: this.$root.$data.pekit,
		};
	},
	props: {
		instance: AppOverviewStore,
	},
	template: '#app-overview',
});
</script>

<template id="app-overview">
	<article class="app-overview">
		<h3>Overview</h3>
	</article>
</template>

<style>
</style>
