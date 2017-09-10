//dachu
//cutil

function bc(color, ctx) {
	var fs = ctx.fillStyle;
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, 640, 480);
	ctx.fillStyle = fs;
}

function tc(text, x, y, color, ctx) {
	var fs = ctx.fillStyle;
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
	ctx.fillStyle = fs;
}

function di(img, x, y, sx, sy, is, ctx) {
	ctx.drawImage(img, x, y, is, is, sx, sy, is, is);
}

function clear(ctx) {
	ctx.clearRect(0, 0, 640, 480);
}

var gmx, gmy;
function mouseMove(evt) {
	gmx = evt.clientX;
	gmy = evt.clientY;
}
document.addEventListener('mousemove', mouseMove, false);
