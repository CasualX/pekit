
<script>
"use strict"

Vue.component('app-header', {
	data: function() {
		return {
			pekit: this.$root.$data.pekit,
		};
	},
	methods: {
		closeFile: function() {
			this.pekit.closeFile();
			this.$root.$data.uistate = null;
		},
	},
	template: '#app-header',
});
</script>

<template id="app-header">
	<header class="app-header">
		<h1 class="select--none">PeKit</h1>
		<div v-if="pekit.hasFile()" class="app-header__command"><span class="app-header__command--filename">{{ pekit.filename }}</span><span class="app-header__command--X select--none" @click="closeFile">✖</span></div>
	</header>
</template>

<style>
.app-header {
	background-color: #333;
	color: #fff;
	padding-left: 2rem;
	position: relative;
	line-height: 3rem;
}
.app-header > h1 {
	margin: 0;
	padding: 0;
}
.app-header__command {
	position: absolute;
	right: 0;
	top: 0;
}
.app-header__filename {
	color: #ddd;
}
.app-header__command--X {
	cursor: pointer;
	padding: 6px 10px 6px 10px;
}
</style>
