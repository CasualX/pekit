
<link rel="component" href="../utils.vue">

<script>
"use strict"

const AppRichStructure = Vue.defineComponent({
	props: {
		value: /** @type {any} */ (null),
	},
	computed: {
		richStructure: function() {
			return /** @type {PeRichStructure} */ (this.value);
		},
		isValid: function() {
			return this.richStructure !== null && this.richStructure.xor_key == this.richStructure.checksum;
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
		<template v-if="!richStructure">
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
