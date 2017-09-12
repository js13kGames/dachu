//dachu
//enemies

Dachu.prototype.drawBlobos = function () {
	for (var i = 0; i < this.creatures.length; i++) {
		this.ctx.drawImage(blobo_a, this.creatures[i].jumping*32, this.creatures[i].direction*32, 32, 32, 0-this.cam.x+this.halfWidth+(this.creatures[i].x*32)-15, 0-this.cam.y+this.halfHeight+(this.creatures[i].y*32)-15, 32, 32);
	}
};

Dachu.prototype.populateEnemies = function () {
	this.blobo(13,12,1);
	this.blobo(2,17,0);
	this.blobo(11,22,1);
	this.blobo(16,27,1);
	this.blobo(26,24,1);
	this.blobo(19,19,1);
	this.blobo(38,11,1);
	this.blobo(38,31,1);
	this.blobo(37,43,1);
	this.blobo(16,40,1);
	this.blobo(13,40,1);
};

Dachu.prototype.blobo = function (xp, yp, dir) {
	this.creatures.push({jumping: false, direction: dir, x: xp, y: yp});
};

Dachu.prototype.moveBlobos = function () {

};
