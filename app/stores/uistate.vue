
<script>
"use strict"

class UIStateStore {
	constructor(groups) {
		this.groups = groups;
		this.pageInstances = [];
		this.runningKey = 0;
		window.uistate = this;
	}
	open(page, options) {
		// If we are given no options, the user clicked on the navbar
		if (options == null) {
			// Try to reuse the last known existing instance
			let foundIndex = this.pageInstances.map(el => el.page).lastIndexOf(page);
			if (foundIndex >= 0) {
				// Push the the found instance to the front of the UI
				let found = this.pageInstances[foundIndex];
				this.pageInstances.splice(foundIndex, 1);
				this.pageInstances.push(found);
				return;
			}
		}
		// Create a new instance with given options
		let instance = new page.factory(options);
		instance.key = this.runningKey++; // Vue needs a unique key...
		// Add the new instance to the front of the UI
		this.pageInstances.push({ page: page, instance: instance });
	}
}

class UIGroupStore {
	constructor(title, pages) {
		this.title = title;
		this.pages = pages;
		this.expanded = true;
	}
}

class UIPageStore {
	constructor(title, factory) {
		this.title = title;
		this.component = factory.COMPONENT_NAME;
		this.factory = factory;
		this.enabled = true;
	}
}
</script>
