
<script>
"use strict"

function hex(value) {
	return value == 0 ? "0" : "0x" + value.toString(16);
}
function display(value) {
	if (typeof value == "number") {
		return hex(value);
	}
	else if (typeof value == "string") {
		return value;
	}
	else if (Array.isArray(value)) {
		return value.map(el => display(el)).join("\n");
	}
	else {
		return "" + value;
	}
}
</script>

<style>
.monospace {
	font-family: 'Fira Code', 'Iosevka', 'Consolas', 'Courier New', monospace;
	white-space: pre;
}
.select--none {
	user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-webkit-user-select: none;
}
.select--contain {
	user-select: contain;
	-moz-user-select: contain;
	-ms-user-select: contain;
	-webkit-user-select: contain;
}
.select--text {
	user-select: text;
	-moz-user-select: text;
	-ms-user-select: text;
	-webkit-user-select: text;
}
</style>
