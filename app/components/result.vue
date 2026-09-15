<script>
"use strict"

const PageResult = Vue.defineComponent({
	props: {
		bindings: Object,
		component: [String, Object],
		result: null,
		title: String,
	},
	computed: {
		error: function() {
			return this.result instanceof Error ? this.result : null;
		},
	},
	template: '#page-result',
});
</script>

<template id="page-result">
	<article v-if="error" class="page-result page-result--error">
		<h3>{{ title }}</h3>
		<p>There was an error reading this data:</p>
		<p>{{ error.message }}</p>
	</article>
	<component v-else :is="component" v-bind="bindings" :value="result"></component>
</template>

<style>
.page-result--error > p:last-child {
	color: #b00020;
	font-family: 'Fira Code', 'Iosevka', 'Consolas', 'Courier New', monospace;
}
</style>
