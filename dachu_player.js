//dachu
//player

Dachu.prototype.drawPlayer = function () {
	var tile = this.ply.frame;
	var xp = (tile % 2) * this.tileSize;
	var yp = (Math.floor(tile / 2)) * this.tileSize;
	var sx = this.ply.pos.x - this.tileSize / 2 - this.cam.x + this.vp.w / 2;
	var sy = this.ply.pos.y - this.tileSize / 2 - this.cam.y + this.vp.h / 2;
	var fx = this.ply.rot * sx - (this.ply.rot == -1 ? this.tileSize : 0); //todo: use a procedurally generated flipped image instead of this
	//nasty trick to flip image (and to recenter it ^^^)
	this.ctx.scale(this.ply.rot, 1);
	this.ctx.drawImage(dachu_a, xp, yp, this.tileSize, this.tileSize, fx, sy, this.tileSize, this.tileSize);
	this.ctx.setTransform(1, 0, 0, 1, 0, 0);
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
}
