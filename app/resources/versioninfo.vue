
<script>
"use strict"

class ResourcesVersionInfoStore {
	constructor(options) {}
}
ResourcesVersionInfoStore.COMPONENT_NAME = 'resources-versioninfo';

Vue.component('resources-versioninfo', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: ResourcesVersionInfoStore,
	},
	computed: {
		error: function() {
			try {
				let _ = this.pefile.resourcesVersionInfo();
				return null;
			}
			catch (ex) {
				return ex;
			}
		},
		versionInfo: function() {
			return this.pefile.resourcesVersionInfo();
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
		<template v-if="error">
			<p>There was an error reading the Version Info:</p>
			<p>{{ error }}</p>
		</template>
		<template v-else-if="!versionInfo">
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
