//dachu
//tilemap

Dachu.prototype.loadMap = function(stagenum) {
	var map = this.decompressString(maps[stagenum]);
	this.mapWidth = parseInt(maps[stagenum].substring(0,2));
	this.mapHeight = parseInt(maps[stagenum].substring(2,4));
	map.splice(0, 4);
	this.map = map;
};

Dachu.prototype.drawTerrain = function () {
	for (i = 0; i < this.mapWidth; i++) {
		for (j = 0; j < this.mapHeight; j++) {
			this.drawTerrainAtPos(i, j, (i*32)+this.halfWidth-this.cam.x-this.tileSize/2, (j*32)+this.halfHeight-this.cam.y-this.tileSize/2);
		}
	}
};

Dachu.prototype.drawGun = function () {
	if (!this.ply.hasGun) {
		this.ctx.drawImage(items, 0, 0, 16, 16, 0-this.cam.x+this.halfWidth+(34*32), 0-this.cam.y+this.halfHeight+(4*32), 16, 16);
		if (this.ply.pos.x > (34*32)) this.ply.hasGun = true;
	} else {
		var sx = this.ply.pos.x - this.tileSize / 2 - this.cam.x + this.vp.w / 2;
		var sy = this.ply.pos.y - this.tileSize / 2 - this.cam.y + this.vp.h / 2;
		this.ctx.drawImage(items, (this.ply.rot == 1 ? 16 : 32), 0, 16, 16, sx+this.ply.rot*-3+7, sy+14, 16, 16);
	}
};

Dachu.prototype.drawTerrainAtPos = function (x, y, sx, sy) {
	var tile = this.getBlock(x, y);
	var xp = (tile % this.tileSetWidth) * this.tileSize;
	var yp = (Math.floor(tile / this.tileSetWidth)) * this.tileSize;
	this.ctx.drawImage(p2p1, xp, yp, this.tileSize, this.tileSize, sx, sy, this.tileSize, this.tileSize);
};

Dachu.prototype.getBlock = function (x, y) {
	return this.map[this.mapWidth*y+x] - 1;
};
