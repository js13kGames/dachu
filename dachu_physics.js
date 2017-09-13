//dachu
//physics

Dachu.prototype.movePlayer = function () {
	this.animateplayer();

	if (this.ply.keysdown[65]) {
		this.ply.vel.x = -3;
		this.ply.rot = 1;
	}
	if (this.ply.keysdown[68]) {
		this.ply.vel.x = 3;
		this.ply.rot = -1;
	}
	if (this.ply.keysdown[32]) {
		if (this.jumpreset) {
			this.ply.vel.y = -3.5;
			if (this.stage == 3) this.ply.vel.y -= 2;
			this.jumpreset = false;
		} else {
			this.ply.vel.y -= 0.1;
		}
	}

	this.ply.pos.x += this.ply.vel.x;
	this.ply.pos.y += this.ply.vel.y;

	this.ply.vel.x *= 0.85;
	//this.ply.vel.y *= 0.8;

    this.ply.vel.y += 0.2;
	this.collideplayer();
};

//todo use idle frame as part of walking anim
Dachu.prototype.animateplayer = function() {
	if ((this.ply.keysdown[65] || this.ply.keysdown[68]) && this.ply.framewait <= 0) {
		if (this.ply.frame != 1 && this.ply.frame != 2) {
			this.ply.frame = 2;
		} else if (this.ply.frame == 2) {
			this.ply.frame = 1;
		} else if (this.ply.frame == 1) {
			this.ply.frame = 2;
		}
		this.ply.framewait = 6;
	} else if (this.ply.framewait <= -200 && this.ply.framewait > -300) {
		this.ply.frame = 3;
	} else if (this.ply.framewait <= 0) {
		this.ply.frame = 0;
	}
	this.ply.framewait--;
}

Dachu.prototype.calculateAABB = function(posx, posy, velx, vely) {
    var tX = posx + velx;
    var tY = posy + vely;

    var t_y_up   = Math.floor(tY / this.tileSize);
    var t_y_down = Math.ceil(tY / this.tileSize);
    var y_near1  = Math.round((posy - 15) / this.tileSize);
    var y_near2  = Math.round((posy + 15) / this.tileSize);

    var t_x_left  = Math.floor(tX / this.tileSize);
    var t_x_right = Math.ceil(tX / this.tileSize);
    var x_near1   = Math.round((posx - 15) / this.tileSize);
    var x_near2   = Math.round((posx + 15) / this.tileSize);

	var top1    = this.isSolid(x_near1, t_y_up);
    var top2    = this.isSolid(x_near2, t_y_up);
    var bottom1 = this.isSolid(x_near1, t_y_down);
    var bottom2 = this.isSolid(x_near2, t_y_down);
    var left1   = this.isSolid(t_x_left, y_near1);
    var left2   = this.isSolid(t_x_left, y_near2);
    var right1  = this.isSolid(t_x_right, y_near1);
    var right2  = this.isSolid(t_x_right, y_near2);
	
    return {
    	bottom: bottom1 || bottom2,
    	top: top1 || top2,
    	left: left1 || left2,
    	right: right1 || right2
    };
}

//all from the platformer codepen
Dachu.prototype.collideplayer = function() {
	var aabb = this.calculateAABB(
		this.ply.pos.x, this.ply.pos.y,
		this.ply.vel.x, this.ply.vel.y);

	if (aabb.bottom) {
		this.ply.vel.y = 0;
		this.jumpreset = true;
	}
	if (aabb.top) {
		this.ply.vel.y = 0.1;
	}
	if (aabb.left) {
		this.ply.pos.x = Math.floor(this.ply.pos.x)-this.ply.vel.x+0.5;
		this.ply.vel.x = 0;
	}
	if (aabb.right) {
		this.ply.pos.x = Math.ceil(this.ply.pos.x)-this.ply.vel.x-0.5;
		this.ply.vel.x = 0;
	}
};

Dachu.prototype.collideblobo = function(creature) {
	var aabb = this.calculateAABB(
		creature.x, creature.y,
		creature.vx, creature.vy);

	if (aabb.bottom) {
		creature.vy = 0;
		creature.jumping = false;
	}
	if (aabb.top) {
		creature.vy = 0.0;
	}
	if (aabb.left) {
		creature.x = Math.floor(creature.x)-creature.vx+1.5;
		creature.vx = 0;
	}
	if (aabb.right) {
		creature.x = Math.ceil(creature.x)-creature.vx-1.5;
		creature.vx = 0;
	}
};

Dachu.prototype.isSolid = function(x, y) {
	return !isNaN(this.getBlock(x, y));
};
