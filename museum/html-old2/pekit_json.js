function pekit_json(f) {
	let imports = {};
	fetch('pekit_json.wasm').then(response =>
		response.arrayBuffer()
	).then(bytes =>
		WebAssembly.instantiate(bytes, imports)
	).then(results => {
		f(results);
	}).catch(reason => {
		console.log(reason);
	});
}

function pekit_dump(bytes, f) {
	pekit_json(function(module) {
		console.log(module);
		let bytes_offset = module.instance.exports.allocate_bytes(bytes.length);
		let bytes_array = new Uint8Array(module.instance.exports.memory.buffer, bytes_offset, bytes.length);
		for (let i = 0; i < bytes.length; ++i) {
			bytes_array[i] = bytes[i];
		}

		let result_offset = module.instance.exports.allocate_bytes(12);
		let success = module.instance.exports.pelite64_json(bytes_offset, bytes.length, result_offset);
		let string_object = new Uint32Array(module.instance.exports.memory.buffer, result_offset, 3);
		let string_array = new Uint8Array(module.instance.exports.memory.buffer, string_object[0], string_object[1]);
		let string = new TextDecoder().decode(string_array);
		console.log(string);
		if (success) {
			f({ Ok: JSON.parse(string) });
		}
		else {
			f({ Err: string });
		}
	});
}
