
<link rel="component" href="../utils.vue">

<script>
"use strict"

const AppScanner = Vue.defineComponent({
	data: function() {
		return {
			pattern: "",
			requestedLimit: 1000,
			range: /** @type {{start: number, end: number}|null} */ (null),
			error: /** @type {Error|null} */ (null),
			matches: /** @type {number[][]|null} */ (null),
			limit: /** @type {number|null} */ (null),
			hex: hex,
		};
	},
	props: {
		value: /** @type {any} */ (null),
		pefile: /** @type {any} */ (null),
	},
	computed: {
		pageData: function() {
			return /** @type {PeScannerData} */ (this.value);
		},
		sections: function() {
			return this.pageData.sections;
		},
	},
	methods: {
		scan: function() {
			this.error = null;
			this.matches = null;
			if (this.pattern) {
				// Limit the limit itself for our sanity
				let limit = Math.min(Math.max(9, this.requestedLimit), 99999);
				let start = 0, end = 0;
				if (this.range) {
					start = this.range.start;
					end = this.range.end;
				}
				else {
					end = this.pageData.imageSize;
				}
				let matches = (/** @type {PeFileInstance} */ (this.pefile)).scannerMatches(this.pattern, start, end, 0, limit);
				if (matches instanceof Error) {
					this.error = matches;
					return;
				}
				this.matches = matches;
				this.limit = limit;
			}
		},
		setRange: function(value) {
			if (value) {
				var match = value.match(/^(\d+)\.\.(\d+)$/);
				let start = parseInt(match[1]);
				let end = parseInt(match[2]);
				this.range = { start: start, end: end };
			}
			else {
				this.range = null;
			}
		},
	},
	template: '#app-analysis-scanner',
});
</script>

<template id="app-analysis-scanner">
	<article class="app-analysis-scanner">
		<h3>Scanner</h3>
		<div class="app-analysis-scanner__input">
			<div>
				<label>Pattern <a href="https://docs.rs/pelite/*/pelite/pattern/fn.parse.html" title="Information about the pattern syntax" target="_blank" rel="noopener noreferrer">?</a></label>
				<input type="text" v-model="pattern" @keyup.enter="scan">
			</div>
			<div><label>Limit matches</label><input type="number" v-model="requestedLimit"></div>
			<div><label>Scan range</label><select @input="setRange($event.target.value)"><option value="" selected>image</option><option v-for="sect in sections" :value="sect.VirtualAddress + '..' + sect.VirtualSize">{{ sect.Name }}</option></select></div>
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
.app-analysis-scanner__input {
	display: grid;
	grid-template-columns: minmax(12rem, 1fr) 10rem 10rem;
	gap: 1rem;
	align-items: end;
}
.app-analysis-scanner__input label {
	display: block;
	margin-bottom: 0.25rem;
}
.app-analysis-scanner__input input,
.app-analysis-scanner__input select {
	box-sizing: border-box;
	width: 100%;
	height: 2rem;
}
.app-analysis-scanner__matches td {
	width: 8rem;
	padding: 0.2rem 0;
}
@media (max-width: 48rem) {
	.app-analysis-scanner__input {
		grid-template-columns: 1fr;
	}
}
</style>
