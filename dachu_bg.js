//dachu
//bg

//https://codepen.io/jet/pen/gwFGl
Dachu.prototype.drawStars = function () {
	var star;
	for (var i = 0; i < this.stars.length; i++) {
		star = this.stars[i];
		star.x = star.x - star.vx;
		if (star.x > 640) {
			star.x = -10;
			star.y = Math.floor(Math.random() * 640);
			star.vx = -Math.floor((Math.random() * 6) + 3);
			star.st = Math.floor(Math.random() * 3);
		}
		this.ctx.drawImage(stars, star.st*3, 0, 3, 5, star.x, star.y, 6, 10);
	}
};

Dachu.prototype.generateStars = function () {
	for (i = 0; i < 25; i++) {
		var star = {
			x: Math.floor(Math.random() * 640),
			y: Math.floor(Math.random() * 480),
			vx: -Math.floor((Math.random() * 6) + 3),
			st: Math.floor(Math.random() * 3),
		};
		this.stars.push(star);
	}
};

Dachu.prototype.drawUFO = function () {
	if (this.ufoframe > 24) this.ufoframe = 0;
	this.ctx.drawImage(ufo, Math.round(this.ufoframe/10)*32, 0, 32, 32, 256, 176, 128, 128);
	this.ufoframe++;
};

Dachu.prototype.drawFires = function () {
	this.ctx.drawImage(flame, Math.floor(this.ufoframe/15%2)*16, 0, 16, 16, 260, 180, 64, 64);
	this.ctx.drawImage(flame, Math.floor(this.ufoframe/15%2)*16, 0, 16, 16, 308, 192, 64, 64);
};

Dachu.prototype.drawAsteriod = function () {
	this.ctx.drawImage(asteroid, this.asteroidframe - 150, 700 - this.asteroidframe - 100, 128, 128);
	this.asteroidframe -= 9;
};

Dachu.prototype.drawMoon = function () {
	this.ctx.drawImage(moon, 50, 50, 128, 128);
};

Dachu.prototype.drawPortal = function (x, y) {
	this.drawSPortal(x, y);
	this.drawSPortal(x, y+1);
};

Dachu.prototype.drawSPortal = function (x, y) {
	this.ctx.drawImage(portal, Math.floor(this.portalframe/20%2)*32, 0, 32, 32, 0-this.cam.x+this.halfWidth+(x*32), 0-this.cam.y+this.halfHeight+(y*32)-16, 32, 32);
	this.portalframe++;
};

//https://stackoverflow.com/a/11770000
Dachu.prototype.fade = function (frame) {
	this.ctx.fillStyle = "#000";
	this.ctx.beginPath();
	this.ctx.arc(320, 240, frame, 0, 2 * Math.PI);
	this.ctx.rect(640, 0, -640, 480);
	this.ctx.fill();
};

Dachu.prototype.fadeOut = function () {
	if (this.fadeframe == 0) this.fadeframe = 640;
	this.fade(this.fadeframe);
	this.fadeframe -= 5;
};

Dachu.prototype.fadeIn = function () {
	if (this.fadeframe == 0) this.fadeframe = 640;
	this.fade(640 - this.fadeframe);
	this.fadeframe -= 5;
};

Dachu.prototype.drawCursor = function () {
	this.canvas.style = "cursor: none;";
	this.ctx.globalCompositeOperation = "difference";
	this.ctx.fillStyle = "white";
	var bbr = this.canvas.getBoundingClientRect();
	var mx = gmx - bbr.left;
	var my = gmy - bbr.top;
	this.drawText(".", mx-8, my-17, 20, 20, 10); //rect won't work, too lazy to fix it
	this.ctx.globalCompositeOperation = "source-over";
};

Dachu.prototype.drawText = function (text, x, y, sx, sy, s) {
	var tl = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.,?=+ ";
	for (var i = 0; i < text.length; i++) {
		this.ctx.drawImage(font, tl.indexOf(text[i])*5, 0, 5, 5, x+i*s, y, sx, sy);
	}
};
