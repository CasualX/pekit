
<script>
"use strict"

class AppRichStructureStore {
	constructor(options) {}
}
AppRichStructureStore.COMPONENT_NAME = 'app-richstructure';

Vue.component('app-richstructure', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: AppRichStructureStore,
	},
	computed: {
		error: function() {
			try {
				let _ = this.pefile.richStructure();
				return null;
			}
			catch (ex) {
				return ex;
			}
		},
		richStructure: function() {
			return this.pefile.richStructure();
		},
		isValid: function() {
			return this.richStructure.xor_key == this.richStructure.checksum;
		},
	},
	methods: {
		hex: hex,
	},
	template: '#app-richstructure',
});
</script>

<template id="app-richstructure">
	<article class="app-richstructure">
		<template v-if="error">
			<p>There was an error reading the RichStructure:</p>
			<p>{{ error }}</p>
		</template>
		<template v-else-if="!richStructure">
			<p>There is no RichStructure.</p>
		</template>
		<template v-else>
			<h3>Properties</h3>
			<table class="entries">
				<tr><th class="text">XOR Key</th><td class="number">{{ hex(richStructure.xor_key) }}</td><td></td></tr>
				<tr><th class="text">Checksum</th><td class="number">{{ hex(richStructure.checksum) }}</td><td></td></tr>
				<tr><th class="text">IsValid</th>
					<template v-if="isValid"><td style="color: limegreen;">✔</td><td>The Checksum matches the XOR Key.</td></template>
					<template v-else><td style="color: red;">❌</td><td>The Checksum does not match the XOR Key!</td></template>
				</tr>
			</table>
			<h3>Records</h3>
			<table class="records">
				<tr>
					<th class="number">Product</th>
					<th class="number">Build</th>
					<th class="number">Count</th>
				</tr>
				<tr v-for="record in richStructure.records">
					<td class="number">{{ record.product }}</td>
					<td class="number">{{ record.build }}</td>
					<td class="number">{{ record.count }}</td>
				</tr>
			</table>
		</template>
	</article>
</template>
