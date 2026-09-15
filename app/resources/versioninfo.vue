
<link rel="component" href="../utils.vue">

<script>
"use strict"

const ResourcesVersionInfo = Vue.defineComponent({
	props: {
		value: /** @type {any} */ (null),
	},
	computed: {
		versionInfo: function() {
			return /** @type {PeVersionInfo} */ (this.value);
		},
	},
	methods: {
		display: display,
	},
	template: '#resources-versioninfo',
});
</script>

<template id="resources-versioninfo">
	<article class="resources-versioninfo">
		<template v-if="!versionInfo">
			<p>There is no Version Info.</p>
		</template>
		<template v-else>
			<h3>Version Info</h3>
			<table class="entries">
				<tr v-for="[key, value] in Object.entries(versionInfo.fixed)">
					<th class="text">{{ key.substring(2) }}</th>
					<td class="number">{{ display(value) }}</td>
				</tr>
			</table>
			<template v-for="lang in versionInfo.langs">
				<h3>Language {{ lang }}</h3>
				<table class="entries">
					<tr v-for="[key, value] in Object.entries(versionInfo.strings[lang])">
						<th class="text">{{ key }}</th>
						<td class="text">{{ value }}</td>
					</tr>
				</table>
			</template>
		</template>
	</article>
</template>
