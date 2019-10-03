
<script>
"use strict"

Vue.component('resources-hexed', {
	data: function() {
		return {};
	},
	computed: {
		data_rows: function() {
			let length = ((this.data.byteLength - 1) / 16 + 1) | 0;
			let rows = [];
			for (let i = 0; i < length; ++i) {
				let offset = i * 16;
				let bytes = new Uint8Array(this.data.buffer, this.data.byteOffset + offset, Math.min(16, this.data.byteLength - offset));
				let ascii = Array.from(bytes).map(byte => byte >= 32 && byte < 0x7f ? String.fromCharCode(byte) : '·').join('');
				rows.push({ offset, bytes, ascii });
			}
			return rows;
		},
	},
	props: {
		data: Uint8Array,
	},
	template: '#resources-hexed',
});
</script>

<template id="resources-hexed">
	<table class="monospace resources-hexed">
		<tr>
			<td></td>
			<th v-for="col in 16" class="select--none">{{ (col - 1).toString(16).padStart(2, '0') }}</th>
			<td></td>
		</tr>
		<tr v-for="row in data_rows">
			<th class="select--none">{{ row.offset.toString(16).padStart(8, '0') }}</th>
			<td v-for="byte in row.bytes">{{ byte.toString(16).padStart(2, '0') }}</td>
			<td v-for="_ in 16 - row.bytes.length"></td>
			<td>{{ row.ascii }}</td>
		</tr>
	</table>
</template>

<style>
table.resources-hexed {
	border-spacing: 5px;
}
table.resources-hexed td {
	font-weight: lighter;
}
table.resources-hexed th {
	font-weight: normal;
	color: blue;
	cursor: default;
}
</style>
