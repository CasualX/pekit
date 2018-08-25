
window.onload = function() {
	let content = document.getElementById("CONTENT");

	document.getElementById("INPUT_FILE").addEventListener('change', function(e) {
		content.innerHTML = "";
		let files = this.files || e.target.files;
		if (files.length > 0) {
			let file = files[0];
			let reader = new FileReader();
			reader.onload = function() {
				let bytes = new Uint8Array(reader.result, 0, reader.result.byteLength);
				pekit_dump(bytes, function(data) {
					content.appendChild(render.text('h1', "PE Kit"));
					content.appendChild(render.headers(data));
				});
			};
			reader.readAsArrayBuffer(file);
		}
	});
};
