
<script>
"use strict"

class AppSectionsStore {
	constructor(data) {
		this.data = data;
	}
}
AppSectionsStore.COMPONENT_NAME = 'app-sections';

Vue.component('app-sections', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: AppSectionsStore,
	},
	computed: {
		headers: function() {
			return this.pefile.headers();
		},
		sectionHeaders: function() {
			return this.headers.SectionHeaders;
		},
		sections: function() {
			return this.sectionHeaders.map((sect, i) => ({
				Name: sect.Name,
				VirtualAddress: hex(sect.VirtualAddress),
				VirtualSize: hex(sect.VirtualSize),
				PointerToRawData: hex(sect.PointerToRawData),
				SizeOfRawData: hex(sect.SizeOfRawData),
				Characteristics: hex(sect.Characteristics),
				details: this.headers.details['SectionHeaders.Characteristics'][i].join('\n'),
			}));
		},
		virtualItems: function() {
			return this.sectionHeaders
				.filter(sect => sect.VirtualAddress != 0 && sect.VirtualSize != 0)
				.map(sect => ({
					name: sect.Name,
					start: sect.VirtualAddress,
					end: sect.VirtualAddress + sect.VirtualSize,
					color: this.charsColor(sect.Characteristics),
				}));
		},
		virtualSize: function() {
			return this.pefile.optionalHeader().SizeOfImage;
		},
	},
	methods: {
		charsColor: function(chars) {
			if (chars & 0x20000000) {
				if (chars & 0x80000000) {
					return 'hsl(0, 50%, 50%)';
				}
				else {
					return 'hsl(60, 50%, 50%)';
				}
			}
			if (chars & 0x80000000) {
				return 'hsl(210, 50%, 50%)';
			}
			else {
				return 'hsl(120, 50%, 50%)';
			}
		},
	},
	template: '#app-sections',
});
</script>

<template id="app-sections">
	<article class="app-sections">
		<h3>Section Headers</h3>
		<table class="records">
			<tr>
				<th class="text">Name</th>
				<th class="number">VirtualAddress</th>
				<th class="number">VirtualSize</th>
				<th class="number">PointerToRawData</th>
				<th class="number">SizeOfRawData</th>
				<th class="number">Characteristics</th>
				<th></th>
			</tr>
			<tr v-for="s in sections">
				<td class="text">{{ s.Name }}</td>
				<td class="number">{{ s.VirtualAddress }}</td>
				<td class="number">{{ s.VirtualSize }}</td>
				<td class="number">{{ s.PointerToRawData }}</td>
				<td class="number">{{ s.SizeOfRawData }}</td>
				<td class="number">{{ s.Characteristics }}</td>
				<td class="text">{{ s.details }}</td>
			</tr>
		</table>
		<h3>Section Layout</h3>
		<section class="app-sections__layout">
			<div class="app-sections__layout-titles">
				<p v-for="item in virtualItems">
					<span class="text">{{ item.name }}</span>
					<span class="app-sections__layout-titles--pct">{{ ((item.end - item.start) / virtualSize * 100).toFixed(1) }}%</span>
				</p>
			</div>
			<div class="app-sections__layout-graph select--none text">
				<span
					v-for="item in virtualItems"
					:style="{
						'left': (item.start / virtualSize * 100).toFixed(1) + '%',
						'width': ((item.end - item.start) / virtualSize * 100).toFixed(1) + '%',
						'background-color': item.color,
					}"
					:title="item.name"
				>{{ item.name }}</span>
			</div>
		</section>
	</article>
</template>

<style>
.app-sections__layout-titles {
	display: flex;
	flex-direction: row;
	justify-content: space-around;
}
.app-sections__layout-titles > p {
	padding: 0;
	text-align: center;
}
.app-sections__layout-titles--pct {
	font-size: smaller;
	color: grey;
}

.app-sections__layout-graph {
	position: relative;
	height: 2.5em;
	border: 1px solid #000000;
	background-color: #000000;
}
.app-sections__layout-graph > span {
	position: absolute;
	display: inline-block;
	height: 2.5em;
	/* Separating sections with a border */
	border-left: 1px solid #000000;
	box-sizing: border-box;
	/* Coloring the section name */
	color: rgba(0, 0, 0, 0.25);
	overflow: hidden;
	line-height: 2.5em;
	text-align: center;
}
</style>
