
<script>
"use strict"

const ResourcesManifest = Vue.defineComponent({
	props: {
		value: /** @type {any} */ (null),
	},
	template: '#resources-manifest',
});
</script>

<template id="resources-manifest">
	<article class="resources-manifest">
		<h3>Manifest</h3>
		<template v-if="!value">
			<p>There is no Manifest.</p>
		</template>
		<template v-else>
			<textarea readonly="readonly" rows="24">{{ value }}</textarea>
		</template>
	</article>
</template>

<style>
.resources-manifest > textarea {
	width: 100%;
	resize: vertical;
}
</style>
