
<script>
"use strict"

class AppDosHeaderStore {
	constructor(options) {}
}
AppDosHeaderStore.COMPONENT_NAME = 'app-dosheader';

Vue.component('app-dosheader', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: AppDosHeaderStore,
	},
	computed: {
		dosHeader: function() {
			return this.pefile.dosHeader();
		},
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
			<tr v-for="[key, value] in Object.entries(dosHeader)">
				<th class="text">{{ key }}</th>
				<td class="number">{{ display(value) }}</td>
			</tr>
		</table>
	</article>
</template>
