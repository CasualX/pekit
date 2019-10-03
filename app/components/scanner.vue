
<script>
"use strict"

class AppScannerStore {
	constructor(options) {
		this.pattern = "";
		this.limit = 1000;
		this.range = null;
	}
}
AppScannerStore.COMPONENT_NAME = 'app-analysis-scanner';

Vue.component('app-analysis-scanner', {
	data: function() {
		return {
			pekit: this.$root.$data.pekit,
			error: null,
			matches: null,
			limit: null,
			hex: hex,
		};
	},
	props: {
		instance: AppScannerStore,
	},
	computed: {
		sections: function() {
			return this.pekit.pefile.sectionHeaders();
		},
	},
	methods: {
		scan: function() {
			this.error = null;
			this.instance.matches = null;
			if (this.instance.pattern) {
				try {
					// Limit the limit itself for our sanity
					let limit = Math.min(Math.max(9, this.instance.limit), 99999);
					let start = 0, end = 0;
					if (this.instance.range) {
						start = this.instance.range.start;
						end = this.instance.range.end;
					}
					else {
						end = this.pekit.pefile.optionalHeader().SizeOfImage;
					}
					this.matches = this.pekit.pefile.scannerMatches(this.instance.pattern, start, end, 0, limit);
					this.limit = limit;
				}
				catch (ex) {
					this.error = ex;
				}
			}
		},
		setRange: function(value) {
			if (value) {
				var match = value.match(/^(\d+)\.\.(\d+)$/);
				let start = parseInt(match[1]);
				let end = parseInt(match[2]);
				this.instance.range = { start: start, end: end };
			}
			else {
				this.instance.range = null;
			}
		},
	},
	template: '#app-analysis-scanner',
});
</script>

<template id="app-analysis-scanner">
	<article class="app-analysis-scanner">
		<h3>Scanner</h3>
		<div class="app-analysis-scanner__pattern">
			<input type="text" v-model="instance.pattern" @keyup.enter="scan">
			<a href="https://docs.rs/pelite/*/pelite/pattern/fn.parse.html" title="Information about the pattern syntax">?</a>
		</div>
		<div class="app-analysis__options">
			<div><label>Limit matches:</label><input type="number" v-model="instance.limit"></div>
			<div><label>Limit range:</label><select @input="setRange($event.target.value)"><option value="" selected>image</option><option v-for="sect in sections" :value="sect.VirtualAddress + '..' + sect.VirtualSize">{{ sect.Name }}</option></select></div>
		</div>
		<p v-if="error">{{ error }}</p>
		<template v-if="matches != null">
			<h3>Matches</h3>
			<p v-if="matches.length >= limit">Found more than {{ limit }} matches, showing only the first {{ limit }} matches:</p>
			<p v-else-if="matches.length > 0 ">Found {{ matches.length }} matches:</p>
			<p v-else>No matches found.</p>
			<table v-if="matches.length > 0" class="app-analysis-scanner__matches">
				<tr>
					<th v-for="i in matches[0].length">{{ i - 1 }}</th>
				</tr>
				<tr v-for="match in matches">
					<td v-for="address in match">{{ hex(address) }}</td>
				</tr>
			</table>
		</template>
	</article>
</template>

<style>
.app-analysis-scanner__pattern {
	display: grid;
	grid-template: auto / auto 1rem;
}
.app-analysis-scanner__pattern > a {
	text-align: center;
}
.app-analysis-scanner__matches td {
	width: 8rem;
}
</style>
