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
		hp: 5,
		keysdown: {}
	};
	this.creatures = [];
	this.bullets = [];
	this.scraps = [];
	this.scrapsleft = 3;
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
		this.populateEnemies();
		this.populateScraps();
		if (!(!(window.ActiveXObject) && "ActiveXObject" in window)) this.readMusic(title);
		this.update();
	};
	this.update = function() {
		//sorry this is a mess, never had time to refactor
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
			this.stopmusic = 1;
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
						if (!(!(window.ActiveXObject) && "ActiveXObject" in window)) this.readMusic(world);
					}
				}
			}
		}
		if (this.stage == 2) {
			bc("#000011", this.ctx);
			this.drawMoon();
			this.drawText("MOVE = WASD", 0-this.cam.x+400, 250, 20, 20, 15);
			this.drawText("JUMP = SPACE", 0-this.cam.x+700, 250, 20, 20, 15);
			this.drawText("BIG JUMP = HOLD SPACE", 0-this.cam.x+1000, 150, 20, 20, 15);
			this.drawPortal(43, 3);
			if (this.ply.pos.x > (33*32)) {
				this.drawText("LOOKS LIKE SOMEONE", 0-this.cam.x+1500, 150, 20, 20, 15);
				this.drawText("STOLE MY SHIP ...", 0-this.cam.x+1500, 200, 20, 20, 15);
				this.drawText("AND LEFT THIS PORTAL", 0-this.cam.x+1500, 250, 20, 20, 15);
			}
			if (this.ply.pos.x > (43*32)) {
				this.flashIn();
				this.loadMap(1);
				this.stage = 3;
				this.ply.pos.x = 3*32;
				this.ply.pos.y = 6*32;
				this.ply.vel.y = 0;
			}
		}
		if (this.stage == 3) {
			var grd = this.ctx.createLinearGradient(0, 0, 0, 480);
			grd.addColorStop(0, "#ffffd8");
			grd.addColorStop(1, "#ffd04f");
			var fs = this.ctx.fillStyle;
			this.ctx.fillStyle = grd;
			this.ctx.fillRect(0, 0, 640, 480);
			this.ctx.fillStyle = fs;
			this.drawText("COLLECT THREE SCRAPS", 0-this.cam.x+400, 0-this.cam.y+350, 20, 20, 15);
			this.drawText("OF MY UFO TO FIX IT", 0-this.cam.x+400, 0-this.cam.y+400, 20, 20, 15);
		}
		if (this.stage == 2 || this.stage == 3) {
			this.drawTerrain();
			if (this.ply.hp > 0) {
				this.drawPlayer();
				this.drawGun();
				this.drawBullets();
			}
			if (this.stage == 3) this.drawBlobos();
			if (this.stage == 3) this.drawScraps();
			this.updateCamera();
			if (this.ply.hp > 0) this.movePlayer();
			if (this.stage == 3) this.moveBlobos();
			this.drawStats();
			if (this.fadeframe != 0) {
				this.fadeIn();
			}
			if (this.flashframe != 0) {
				this.flashIn();
			}
			if (this.ply.pos.y > 1792) this.ply.hp = 0;
			if (this.scrapsleft <= 0) {
				this.drawText("IT IS FIXED. LETS GET OUT OF HERE.", 50, 350, 20, 20, 15);
				this.drawPortal(37,50);
				if (this.ply.pos.x > (37*32) &&
						this.ply.pos.y > (49*32)) {
					this.stage = 4;
					this.fadeOut();
				}
			}
			this.drawCursor();
		}
		if (this.stage == 4) {
			this.ctx.fillStyle = "#000";
			this.ctx.fillRect(0, 0, 640, 480);
			this.drawText("DACHU", 200, 250, 20, 20, 15);
			this.drawText("CREATED IN NINE DAYS?", 50, 300, 20, 20, 15);
			this.drawText("THANKS FOR PLAYING.", 50, 350, 20, 20, 15);
		}
		window.requestAnimFrame(function() { self.update(); });
	};
	//</editor-fold>

	//<editor-fold> background, menu, and other effects
	this.ufoframe = 0;
	this.asteroidframe = 700;
	this.fadeframe = 0;
	this.portalframe = 0;
	this.flashframe = 0;
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
	};
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
	this.riptime = 600;
	this.map = [];
	//</editor-fold>

	//<editor-fold> input
	this.setupInput();
	//</editor-fold>
}
