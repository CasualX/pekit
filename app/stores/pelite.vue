
<script>
"use strict"

class PeLiteStore {
	constructor() {
		this.instance = null;
		this.state = {
			ready: false,
			error: false,
			reason: null,
		};
		pelite("pelite.wasm").then(value => {
			this.instance = value;
			this.state.ready = true;
		}, reason => {
			this.state.error = true;
			this.state.reason = reason;
		});
	}
}
var peliteStore = new PeLiteStore();
</script>
