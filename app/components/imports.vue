
<script>
"use strict"

class AppImportsStore {
	constructor(options) {}
}
AppImportsStore.COMPONENT_NAME = 'app-imports';

Vue.component('app-imports', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
			state: {},
		};
	},
	props: {
		instance: AppImportsStore,
	},
	computed: {
		imports: function() {
			return this.pefile.imports();
		},
	},
	methods: {
		expand: function(dll_name) {
			Vue.set(this.state, dll_name, true);
		},
		expandAll: function() {
			for (let imp of this.imports) {
				Vue.set(this.state, imp.dll_name, true);
			}
		},
		collapse: function(dll_name) {
			Vue.set(this.state, dll_name, false);
		},
		collapseAll: function() {
			this.state = {};
		},
		toggle: function(dll_name) {
			Vue.set(this.state, dll_name, !this.state[dll_name]);
		},
	},
	template: '#app-imports',
});
</script>

<template id="app-imports">
	<article class="app-imports">
		<p><button @click="expandAll()">Expand All</button> <button @click="collapseAll()">Collapse All</button></p>
		<template v-for="desc in imports">
			<template v-if="desc.int">
				<h3 :class="{ collapsed: !state[desc.dll_name] }">
					{{ desc.dll_name }}<p @click="toggle(desc.dll_name)" class="select--none">{{ desc.int.length }} imports {{ state[desc.dll_name] ? '▼' : '▷' }}</p>
				</h3>
				<table v-if="state[desc.dll_name]" class="records">
					<tr>
						<th class="number" style="width: 5em">Hint</th>
						<th class="text" style="width: 5em">Name</th>
					</tr>
					<tr v-for="imp in desc.int">
						<template v-if="imp.ByName">
							<td class="number">{{ imp.ByName.hint }}</td>
							<td class="text">{{ imp.ByName.name }}</td>
						</template>
						<template v-if="imp.ByOrdinal">
							<td class="number">ord</td>
							<td class="text">{{ imp.ByOrdinal.ord }}</td>
						</template>
					</tr>
				</table>
			</template>
			<template v-else>
				<h3 class="collapsed">{{ desc.dll_name }}</h3>
				<p>Error reading the import name table.</p>
			</template>
		</template>
	</article>
</template>

<style>
.app-imports > h3 {
	position: relative;
}
.app-imports > h3.collapsed {
	border-bottom: none;
}
.app-imports > h3 > p {
	position: absolute;
	top: 0;
	right: 0;
	margin: 0;
	font-weight: normal;
	font-size: 12pt;
	cursor: pointer;
}
</style>
