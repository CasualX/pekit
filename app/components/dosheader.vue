
<link rel="component" href="../utils.vue">

<script>
"use strict"

const AppDosHeader = Vue.defineComponent({
	props: {
		value: /** @type {any} */ (null),
	},
	methods: {
		display: display,
	},
	template: '#app-dosheader',
});
</script>

<template id="app-dosheader">
	<article class="app-dosheader">
		<h3>DOS Header</h3>
		<table class="entries">
			<tr v-for="[key, field] in Object.entries(value)">
				<th class="text">{{ key }}</th>
				<td class="number">{{ display(field) }}</td>
			</tr>
		</table>
	</article>
</template>
