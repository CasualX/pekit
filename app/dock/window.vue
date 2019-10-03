
<script>
"use strict"

Vue.component('dock-window', {
	data: function() {
		return {
			x: 0,
			y: 0,
			width: 400,
			height: 300,
			minWidth: 200,
			minHeight: 150,
			title: "",
			dragging: false,
		};
	},
	props: {
		"componentName": String,
		"componentData": Object,
	},
	computed: {
		style: function() {
			return {
				left: this.x + "px",
				top: this.y + "px",
				width: this.width + "px",
				height: this.height + "px",
			}
		},
	},
	methods: {
		setTitle: function(title) {
			this.title = title;
		},
		dragWindow: function(e) {
			if (e.button != 0)
				return;
			e.preventDefault();
			this.dragging = true;
			let mousemove = e => {
				e.preventDefault();
				this.x += e.movementX;
				this.y += e.movementY;
			};
			let mouseup = e => {
				e.preventDefault();
				this.dragging = false;
				document.removeEventListener('mousemove', mousemove, false);
				document.removeEventListener('mouseup', mouseup, false);
				document.body.classList.remove('dock-window--dragging');
			};
			document.addEventListener('mousemove', mousemove, false);
			document.addEventListener('mouseup', mouseup, false);
			document.body.classList.add('dock-window--dragging');
		},
		resizeWindow: function(e) {
			if (e.target != e.currentTarget)
				return;

			let rect = e.target.getBoundingClientRect();
			let x = e.clientX - rect.left;
			let y = e.clientY - rect.top;
			let margin = 5;

			let cursor = "dock-window--ns-resize";
			if (x < margin) {
				cursor = "dock-window--ew-resize";
				if (y < margin) {
					cursor = "dock-window--nwse-resize";
				}
				else if (y >= rect.height - margin) {
					cursor = "dock-window--nesw-resize";
				}
			}
			else if (x >= rect.width - margin) {
				cursor = "dock-window--ew-resize";
				if (y < margin) {
					cursor = "dock-window--nesw-resize";
				}
				else if (y >= rect.height - margin) {
					cursor = "dock-window--nwse-resize";
				}
			}

			let desiredWidth = rect.width;
			let desiredHeight = rect.height;
			let mousemove = e => {
				if (x < margin) {
					this.x += e.movementX;
					desiredWidth -= e.movementX;
					this.width = Math.max(desiredWidth, this.minWidth);
				}
				if (y < margin) {
					this.y += e.movementY;
					desiredHeight -= e.movementY;
					this.height = Math.max(desiredHeight, this.minHeight);
				}
				if (x >= rect.width - margin) {
					desiredWidth += e.movementX;
					this.width = Math.max(desiredWidth, this.minWidth);
				}
				if (y >= rect.height - margin) {
					desiredHeight += e.movementY;
					this.height = Math.max(desiredHeight, this.minHeight);
				}
			};
			let mouseup = e => {
				document.removeEventListener('mousemove', mousemove, false);
				document.removeEventListener('mouseup', mouseup, false);
				document.body.classList.remove(cursor);
			};
			document.addEventListener('mousemove', mousemove, false);
			document.addEventListener('mouseup', mouseup, false);
			document.body.classList.add(cursor);
		},
	},
	template: '#dock-window',
});
</script>

<template id="dock-window">
	<div class="dock-window select--none" :style="style" @mousedown="resizeWindow">
		<div class="dock-window__client">
			<h2 class="dock-window__title" @mousedown="dragWindow">{{ title }}</h2>
			<div class="dock-window__slot select--text"><component :is="componentName" :data="componentData" @set-title="setTitle"></slot></div>
		</div>
	</div>
</template>

<style>
.dock-window {
	position: absolute;
	display: grid;
	padding: 5px;
}
.dock-window__client {
	display: grid;
	grid-template: 2rem auto / auto;
	grid-template-areas: "title" "slot";
	background-color: #ddd;
	border: 1px solid black;
}
.dock-window--dragging {
	cursor: grabbing !important;
}
.dock-window--ew-resize {
	cursor: ew-resize !important;
}
.dock-window--ns-resize {
	cursor: ns-resize !important;
}
.dock-window--nesw-resize {
	cursor: nesw-resize !important;
}
.dock-window--nwse-resize {
	cursor: nwse-resize !important;
}
.dock-window__title {
	grid-area: title;
	margin: 0;
	padding: 0;
	line-height: 2rem;
	overflow: hidden;
	white-space: nowrap;
}
.dock-window__slot {
	grid-area: slot;
	display: grid;
	overflow: hidden;
}
</style>
