//dachu
//executable

var Dachu = function () {
	var self = this;

	//<editor-fold> game
	this.cam = {
		x: 0,
		y: 0
	};
	this.vp = {
        w: 640,
        h: 480
    };
	this.ply = {
		pos: {
			x: 3*32,
			y: 4*32
		},
		vel: {
			x: 0,
			y: 0
		},
		rot: -1,
		frame: 0,
		framewait: 0,
		jumpreset: true,
		hasgun: false,
		keysdown: {}
	};
	this.stage = 0;
	//</editor-fold>

	//<editor-fold> canvas
	this.canvas = document.createElement("canvas");
	this.canvas.width = 640;
	this.canvas.height = 480;
	this.canvas.id = "game";
	document.body.appendChild(this.canvas);
	this.ctx = this.canvas.getContext("2d");
	this.ctx.font = "28px Courier New";
	this.ctx.webkitImageSmoothingEnabled = false;
	this.ctx.mozImageSmoothingEnabled = false;
	this.ctx.imageSmoothingEnabled = false;
	//</editor-fold>

	//<editor-fold> game events
	window.requestAnimFrame = (function() {
		return  window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
		        function(callback) {
		        	window.setTimeout(callback, 17);
		        };
    })();
	this.start = function() {
		this.pollInput();
		this.generateStars();
		this.update();
	};
	this.update = function() {
		if (this.stage == 0) {
			bc("#000011", this.ctx);
			this.drawStars();
			this.drawUFO();
			this.drawText("DACHU", 215, 400, 50, 50, 40);
			this.drawText("SPACE TO BEGIN", 210, 350, 20, 20, 15);
			if (this.ply.keysdown[32]) {
				this.stage = 1;
				this.waittimer = 150;
			}
		}
		if (this.stage == 1) {
			bc("#000011", this.ctx);
			this.drawStars();
			this.drawUFO();
			if (this.waittimer > 0) {
				this.waittimer--;
			} else {
				if (this.asteroidframe < 390) {
					this.drawFires();
				}
				this.drawAsteriod();
				if (this.asteroidframe < -500) {
					this.fadeOut();
					if (this.fadeframe == 0) {
						this.stage = 2;
						this.loadMap(0);
						this.fadeIn();
					}
				}
			}
		}
		if (this.stage == 2) {
			bc("#000011", this.ctx);
			this.drawText("MOVE    JUMP", 0-this.cam.x+400, 250, 20, 20, 15);
			this.drawText("WASD   SPACE", 0-this.cam.x+400, 300, 20, 20, 15);
			this.drawMoon();
			this.drawPortal(43, 3);
			if (this.ply.pos.x > (43*32)) {
				this.loadMap(1);
				this.stage = 3;
				this.ply.pos.x = 3*32;
				this.ply.pos.y = 6*32;
			}
		}
		if (this.stage == 3) {
			bc("#f1e767", this.ctx);
		}
		if (this.stage == 2 || this.stage == 3) {
			this.drawTerrain();
			this.drawPlayer();
			this.drawGun();
			this.updateCamera();
			this.movePlayer();
			if (this.fadeframe != 0) {
				this.fadeIn();
			}
			this.drawCursor();
		}
		window.requestAnimFrame(function() { self.update(); });
	};
	//</editor-fold>

	//<editor-fold> background, menu, and other effects
	this.ufoframe = 0;
	this.asteroidframe = 700;
	this.fadeframe = 0;
	this.portalframe = 0;
	this.shipfire = false;
	this.stars = [];
	//</editor-fold>

	//<editor-fold> compression
	this.decompressString = function(str) {
		var data = [];
		for (var i = 0; i < str.length; i++) {
			var c = str.charCodeAt(i) - 35;
			if (c == 0) {
				data.push(NaN);
				continue;
			}
			data.push(c);
		}
		return data;
	}
	//</editor-fold>

	//<editor-fold> tilemap
	this.tileSize = 32;
	this.maxWidth = (this.vp.w/this.tileSize)+2;  //maximum amount of tiles shown horizontally
	this.maxHeight = (this.vp.h/this.tileSize)+2; //maximum amount of tiles shown vertically
	this.halfWidth = this.vp.w/2;
	this.halfHeight = this.vp.h/2;
	this.mapWidth = 50;
	this.mapHeight = 9;
	this.tileSetWidth = 6;
	this.map = [];
	//</editor-fold>

	//<editor-fold> input
	this.disableInput();
	//</editor-fold>
}