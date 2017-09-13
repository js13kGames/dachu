//dachu
//enemies

Dachu.prototype.drawBlobos = function () {
	for (var i = 0; i < this.creatures.length; i++) {
		this.ctx.drawImage(blobo_a, this.creatures[i].jumping*32, this.creatures[i].direction*32, 32, 32, 0-this.cam.x+this.halfWidth+(this.creatures[i].x)-15, 0-this.cam.y+this.halfHeight+(this.creatures[i].y)-15, 32, 32);
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
	this.creatures.push({jumping: false, direction: dir, x: xp*32, y: yp*32, vx: 0, vy: 0, queuedeletion: false});
};

Dachu.prototype.moveBlobos = function () {
	var lenc = 0;
	for (var i = 0; i < this.creatures.length - lenc; i++) {
		var blobo = this.creatures[i];
		if (this.bloboInRadius(blobo) && !blobo.jumping) {
			blobo.jumping = true;
			var ovx = blobo.x - this.ply.pos.x;
			var ovy = blobo.y - this.ply.pos.y;
			blobo.vx = (ovx < 0 ? 1 : -1)*4;
			blobo.vy = Math.min(-Math.abs(ovy*2)/32,-1); //cheap abs check
			blobo.direction = ovx < 0 ? 0 : 1;
		}

		blobo.x += blobo.vx;
		blobo.y += blobo.vy;

		blobo.vx *= 0.95;
		blobo.vy += 0.2;
		this.collideblobo(blobo);
		if (blobo.queuedeletion) {
			this.creatures.splice(i, 1);
			i--;
			lenc++;
		}
	}
};

Dachu.prototype.bloboInRadius = function (blobo) {
	if (Math.abs(blobo.x-this.ply.pos.x) < 160 &&
			Math.abs(blobo.x-this.ply.pos.x) > 16 &&
			Math.abs(blobo.y-this.ply.pos.y) < 140) {
		return true;
	}
	if (Math.abs(blobo.x-this.ply.pos.x) < 32 &&
			Math.abs(blobo.y-this.ply.pos.y) < 32) {
		this.inflictDamage();
	}
	for (var i = 0; i < this.bullets.length; i++) {
		var bullet = this.bullets[i];
		if (Math.abs((blobo.x+16)-bullet.x) < 16 &&
				Math.abs((blobo.y+16)-bullet.y) < 16) {
			blobo.queuedeletion = true;
		}
	}
	return false;
};
