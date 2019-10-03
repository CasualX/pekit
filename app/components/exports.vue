
<script>
"use strict"

class AppExportsStore {
	constructor(options) {}
}
AppExportsStore.COMPONENT_NAME = 'app-exports';

Vue.component('app-exports', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: AppExportsStore,
	},
	computed: {
		exports: function() {
			return this.pefile.exports();
		},
		names: function() {
			return Object.entries(this.exports.names);
		},
		symbols: function() {
			let names = new Array(this.exports.functions.length);
			this.names.forEach(([name, index]) => {
				names[index] = names[index] || [];
				names[index].push(name);
			});
			let symbols = this.exports.functions.map((address, index) => ({
				empty: address == 0 && !names[index],
				address: hex(address),
				ordinal: this.exports.ordinal_base + index,
				names: names[index],
			})).filter(sym => !sym.empty);
			return symbols;
		},
	},
	methods: {
		hex: hex,
		display: display,
	},
	template: '#app-exports',
});
</script>

<template id="app-exports">
	<article class="app-exports">
		<h3>Properties</h3>
		<table class="entries">
			<tr><th class="text">DllName</th><td class="number">{{ exports.dll_name }}</td></tr>
			<tr><th class="text">TimeDateStamp</th><td class="number">{{ hex(exports.time_date_stamp) }}</td><td>{{ new Date(exports.time_date_stamp * 1000) }}</td></tr>
			<tr><th class="text">Version</th><td class="number">{{ exports.version }}</td></tr>
			<tr><th class="text">OrdinalBase</th><td class="number">{{ exports.ordinal_base }}</td></tr>
			<tr><th class="text">NumberOfFunctions</th><td class="number">{{ exports.functions.length }}</td></tr>
			<tr><th class="text">NumberOfNames</th><td class="number">{{ names.length }}</td></tr>
		</table>
		<h3>Symbols</h3>
		<table class="records">
			<tr>
				<th class="number">Ord</th>
				<th class="number">Address</th>
				<th class="text">Name</th>
			</tr>
			<tr v-for="sym in symbols">
				<td class="number">{{ sym.ordinal }}</td>
				<td class="number">{{ sym.address }}</td>
				<td class="text">{{ display(sym.names || []) }}</td>
			</tr>
		</table>
	</article>
</template>
