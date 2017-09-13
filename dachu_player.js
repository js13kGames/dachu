//dachu
//player

Dachu.prototype.drawPlayer = function () {
	var tile = this.ply.frame;
	var xp = (tile % 2) * this.tileSize;
	var yp = (Math.floor(tile / 2)) * this.tileSize;
	var sx = this.ply.pos.x - this.tileSize / 2 - this.cam.x + this.vp.w / 2;
	var sy = this.ply.pos.y - this.tileSize / 2 - this.cam.y + this.vp.h / 2;
	var fx = this.ply.rot * sx - (this.ply.rot == -1 ? this.tileSize : 0);
	//nasty trick to flip image (and to recenter it ^^^)
	this.ctx.scale(this.ply.rot, 1);
	this.ctx.drawImage(dachu_a, xp, yp, this.tileSize, this.tileSize, fx, sy, this.tileSize, this.tileSize);
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);

	if (this.damagetimer > 0) this.damagetimer--;
};

Dachu.prototype.updateCamera = function () {
	var pxh = Math.round(this.ply.pos.x);
	var pyh = Math.round(this.ply.pos.y);
	this.cam.x = pxh;
	this.cam.y = pyh;
	//keeps the camera in bounds
	this.cam.x = Math.max(this.vp.w/2, this.cam.x);
	this.cam.x = Math.min(this.mapWidth * this.tileSize - this.tileSize/2 - this.vp.w/2, this.cam.x);
	this.cam.y = Math.max(this.vp.h/2, this.cam.y);
	this.cam.y = Math.min(this.mapHeight * this.tileSize - this.tileSize/2 - this.vp.h/2, this.cam.y);
};

Dachu.prototype.inflictDamage = function () {
	if (this.damagetimer > 0) return;
	this.damagetimer = 200;
	this.ply.hp--;
	this.ply.vel.y -= 5;
};

Dachu.prototype.shootGun = function () {
	var bbr = this.canvas.getBoundingClientRect();
	var mx = gmx - bbr.left;
	var my = gmy - bbr.top;
	var sx = mx + this.cam.x / this.tileSize;
	var sy = my + this.cam.y / this.tileSize;
	var psx = this.ply.pos.x - this.tileSize / 2 - this.cam.x + this.vp.w / 2;
	var psy = this.ply.pos.y - this.tileSize / 2 - this.cam.y + this.vp.h / 2;
	var direction = (Math.atan2(psy-sy,sx-psx)) * 180 / Math.PI; //close enough, not enough time to fix anyway
	this.bullets.push({x: this.ply.pos.x+16, y: this.ply.pos.y+22, d: direction});
};

Dachu.prototype.drawBullets = function () {
	var fs = this.ctx.fillStyle;
	var ol = this.ctx.strokeStyle;
	this.ctx.fillStyle = "#f00";
	var lenc = 0;
	for (var i = 0; i < this.bullets.length - lenc; i++) {
		var bullet = this.bullets[i];
		var movement = this.localTranslation(bullet.x, bullet.y, bullet.d, 8);
		bullet.x = movement.x;
		bullet.y = movement.y;
		var sx = bullet.x-1 - this.tileSize / 2 - this.cam.x + this.vp.w / 2;
		var sy = bullet.y-1 - this.tileSize / 2 - this.cam.y + this.vp.h / 2;
		this.ctx.fillRect(sx, sy, 2, 2);
		if (this.isSolid(Math.floor(bullet.x/32), Math.floor(bullet.y/32))) {
			this.bullets.splice(i, 1);
			i--;
			lenc++;
		}
	}
	this.ctx.fillStyle = fs;
	this.ctx.strokeStyle = ol;
};

Dachu.prototype.localTranslation = function (x, y, dir, dist) {
	var nx = x + dist * Math.cos(-dir*Math.PI/180);
	var ny = y + dist * Math.sin(-dir*Math.PI/180);
	return {x: nx, y: ny};
};
