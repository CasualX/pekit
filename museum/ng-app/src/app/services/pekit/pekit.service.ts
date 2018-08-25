import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';

declare var WebAssembly;
declare var TextDecoder;

@Injectable({
	providedIn: 'root'
})
export class PeKitService {
	wasm: any;
	private resultSubject$: BehaviorSubject<{ data: any, error: string }>;
	resultObservable$: Observable<{ data: any, error: string }>;

	private static parseBinInternal(obj, image) {
		// Allocate and copy the input image
		const ptr = obj.instance.exports.allocate_bytes(image.length);
		const memory = new Uint8Array(obj.instance.exports.memory.buffer, ptr, image.length);
		memory.set(image);

		// Allocate the return string
		const result = obj.instance.exports.string_allocate();

		// Invoke pelite json to_string
		const success = obj.instance.exports.to_string(ptr, image.length, result);

		// Extract the resulting string
		const str_data = obj.instance.exports.string_data(result);
		const str_len = obj.instance.exports.string_len(result);
		const str_bytes = new Uint8Array(obj.instance.exports.memory.buffer, str_data, str_len);
		const str_decoder = new TextDecoder('utf-8');
		const string = str_decoder.decode(str_bytes);

		// Cleanup resources
		obj.instance.exports.free_bytes(ptr, image.length);
		obj.instance.exports.string_free(result);

		return { success, string };
	}

	constructor() {
		this.instantiate();
		this.resultSubject$ = new BehaviorSubject<{ data: any, error: string }>({ data: undefined, error: undefined });
		this.resultObservable$ = this.resultSubject$.asObservable();
	}

	private async instantiate() {
		const response = await fetch('assets/pekit.wasm');
		const arrayBuffer = await response.arrayBuffer();
		this.wasm = await WebAssembly.instantiate(arrayBuffer, {});
	}

	public parseNext(array: Uint8Array) {
		this.parse(array)
		.then(json =>  this.resultSubject$.next({ data: json, error: '' }))
		.catch(reason => this.resultSubject$.next({ data: null, error: reason.toString() }));
	}

	private parse(image: Uint8Array): Promise<any> {
		return new Promise((resolve, reject) => {
			if (this.wasm) {
				const { success, string } = PeKitService.parseBinInternal(this.wasm, image);
				if (success) {
					resolve(JSON.parse(string));
				} else {
					reject(string);
				}
			} else {
				reject('wasm not loaded');
			}
		});
	}
}
