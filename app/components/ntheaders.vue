
<script>
"use strict"

class AppNtHeadersStore {
	constructor(options) {}
}
AppNtHeadersStore.COMPONENT_NAME = 'app-ntheaders';

Vue.component('app-ntheaders', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: AppNtHeadersStore,
	},
	computed: {
		headers: function() {
			return this.pefile.headers();
		},
		ntHeaders: function() {
			return this.headers.NtHeaders;
		},
		fileHeader: function() {
			return this.headers.FileHeader;
		},
		optionalHeader: function() {
			return this.headers.OptionalHeader;
		},
		dataDirectory: function() {
			let dataDir = [];
			for (let i = 0; i < this.headers.DataDirectory.length; i++) {
				if (this.headers.DataDirectory[i].VirtualAddress != 0) {
					let name = this.headers.details['DataDirectory.Names'][i];
					let section = this.headers.details['DataDirectory.Sections'][i];
					let sectionName = section !== null ? this.headers.SectionHeaders[section].Name : "";
					let address = this.headers.DataDirectory[i].VirtualAddress;
					let size = this.headers.DataDirectory[i].Size;
					dataDir.push({ name: name, section: sectionName, address: address, size: size });
				}
			}
			return dataDir;
		},
	},
	methods: {
		display: display,
		detail: function(header, key, value) {
			if (header + '.' + key in this.headers.details) {
				let detail = this.headers.details[header + '.' + key];
				if (Array.isArray(detail)) {
					return detail.map(el => display(el)).join("\n");
				}
				else {
					return display(detail);
				}
			}
			else if (key == "TimeDateStamp") {
				return new Date(value * 1000).toString();
			}
			return "";
		},
	},
	template: '#app-ntheaders',
});
</script>

<template id="app-ntheaders">
	<article class="app-ntheaders">
		<h3>NT Headers</h3>
		<table class="entries">
			<tr>
				<th class="text">Signature</th>
				<td class="number">{{ display(ntHeaders.Signature) }}</td>
				<td class="text">{{ detail('NtHeaders', 'Signature', ntHeaders.Signature) }}</td>
			</tr>
		</table>
		<h3>File Header</h3>
		<table class="entries">
			<tr v-for="[key, value] in Object.entries(ntHeaders.FileHeader)">
				<th class="text">{{ key }}</th>
				<td class="number">{{ display(value) }}</td>
				<td class="text">{{ detail('FileHeader', key, value) }}</td>
			</tr>
		</table>
		<h3>Optional Header</h3>
		<table class="entries">
			<tr v-for="[key, value] in Object.entries(ntHeaders.OptionalHeader)">
				<th class="text">{{ key }}</th>
				<td class="number">{{ display(value) }}</td>
				<td class="text">{{ detail('OptionalHeader', key, value) }}</td>
			</tr>
		</table>
		<h3>Data Directory</h3>
		<table class="records">
			<tr><th class="text">Name</th><th class="text">Section</th><th class="number">VirtualAddress</th><th class="number">Size</th></tr>
			<tr v-for="data in dataDirectory">
				<td class="text">{{ data.name }}</td>
				<td class="text">{{ data.section }}</td>
				<td class="number">{{ display(data.address) }}</td>
				<td class="number">{{ display(data.size) }}</td>
			</tr>
		</table>
	</article>
</template>

<style>
.app-ntheaders > table.entries > tbody > tr > th {
	width: 14rem;
}
.app-ntheaders > table.entries > tbody > tr > td:nth-child(2) {
	width: 10rem;
}
</style>
