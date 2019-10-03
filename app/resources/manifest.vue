
<script>
"use strict"

class ResourcesManifestStore {
	constructor(options) {}
}
ResourcesManifestStore.COMPONENT_NAME = 'resources-manifest';

Vue.component('resources-manifest', {
	data: function() {
		return {
			pefile: this.$root.$data.pekit.pefile,
		};
	},
	props: {
		instance: ResourcesManifestStore,
	},
	computed: {
		error: function() {
			try {
				let _ = this.pefile.resourcesManifest();
				return null;
			}
			catch (ex) {
				return ex;
			}
		},
		manifest: function() {
			return this.pefile.resourcesManifest();
		},
	},
	template: '#resources-manifest',
});
</script>

<template id="resources-manifest">
	<article class="resources-manifest">
		<h3>Manifest</h3>
		<template v-if="error">
			<p>There was an error reading the Manifest:</p>
			<p>{{ error }}</p>
		</template>
		<template v-else-if="!manifest">
			<p>There is no Manifest.</p>
		</template>
		<template v-else>
			<textarea readonly="readonly" rows="24">{{ manifest }}</textarea>
		</template>
	</article>
</template>

<style>
.resources-manifest > textarea {
	width: 100%;
	resize: vertical;
}
</style>
