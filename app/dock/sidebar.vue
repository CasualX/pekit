
<script>
Vue.component('dock-sidebar', {
	data: function() {
		return {
			uistate: this.$root.$data.uistate,
		};
	},
	computed: {
		activePage: function() {
			if (this.uistate.pageInstances.length > 0) {
				return this.uistate.pageInstances[this.uistate.pageInstances.length - 1].page;
			}
			else {
				return null;
			}
		},
	},
	methods: {
		open: function(page) {
			this.uistate.open(page, null);
		},
	},
	template: '#dock-sidebar',
});
</script>

<template id="dock-sidebar">
	<nav class="dock-sidebar select--none">
		<template v-for="group in uistate.groups">
			<h2>{{ group.title }}</h2>
			<div
				v-for="page in group.pages"
				:class="{
					selected: page == activePage,
					enabled: page.enabled,
					disabled: !page.enabled,
				}"
				@click.prevent="open(page)"
			>
				{{ page.title }}
			</div>
		</template>
	</nav>
</template>

<style>
.dock-sidebar {
	overflow-y: auto;

	background-color: #f5f5f5;
	border-right: 1px solid #eee;
}
.dock-sidebar > div {
	cursor: default;
	color: #337ab7;
	padding: 8px 15px;
}
.dock-sidebar > div.enabled {
	cursor: pointer;
}
.dock-sidebar > div.enabled:hover {
	color: #428bca;
	background-color: #eee;
}
.dock-sidebar > div.enabled.selected {
	cursor: default;
	color: #fff;
	background-color: #428bca;
}
.dock-sidebar > div.disabled {
	display: none;
}
/*
.dock-sidebar > ul > li.enabled:after {
	content: "â–·";
	float: right;
	opacity: 50%;
}
.dock-sidebar > ul > li.enabled.selected:after {
	content: "â–¶";
}
*/
</style>
