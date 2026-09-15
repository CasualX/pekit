<link rel="component" href="components/result.vue">

<script>
"use strict"

function resolvePage(page) {
	if (page.resolved) return;
	try {
		const result = page.load();
		page.result = result && typeof result === "object" ? Object.freeze(result) : result;
	}
	catch (reason) {
		page.result = reason instanceof Error ? reason : new Error(String(reason));
	}
	page.resolved = true;
}

const AppWorkspace = Vue.defineComponent({
	data: function() {
		const groups = /** @type {any[]} */ (appState.pages || []);
		const activePage = groups[0]?.pages[0] || null;
		if (activePage) resolvePage(activePage);
		return { groups, activePage };
	},
	methods: {
		open: function(page) {
			resolvePage(page);
			this.activePage = page;
		},
	},
	template: '#app-workspace',
});
</script>

<template id="app-workspace">
	<div class="app-workspace">
		<nav class="app-navigation select--none">
			<template v-for="group in groups">
				<h2>{{ group.title }}</h2>
				<div
					v-for="page in group.pages"
					:class="{ selected: page == activePage }"
					@click="open(page)"
				>{{ page.title }}</div>
			</template>
		</nav>
		<page-result
			v-if="activePage"
			:bindings="activePage.bindings"
			:component="activePage.component"
			:result="activePage.result"
			:title="activePage.title"
		></page-result>
	</div>
</template>

<style>
.app-workspace {
	display: grid;
	grid-template-columns: 10rem minmax(0, 1fr);
}
.app-workspace > article {
	padding: 0 1rem;
	overflow: auto;
}

.app-navigation {
	overflow-y: auto;
	background-color: #f5f5f5;
	border-right: 1px solid #eee;
}
.app-navigation > div {
	cursor: pointer;
	color: #337ab7;
	padding: 8px 15px;
}
.app-navigation > div:hover {
	color: #428bca;
	background-color: #eee;
}
.app-navigation > div.selected {
	cursor: default;
	color: #fff;
	background-color: #428bca;
}
</style>
