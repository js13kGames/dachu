//dachu
//input

//https://stackoverflow.com/a/8916697
Dachu.prototype.setupInput = function () {
	var that = this;
	window.addEventListener("keydown", function(e) {
	    if(e.keyCode == 32) {
	        e.preventDefault();
	    }
	}, false);
	document.addEventListener("contextmenu", function(e) {
		e.preventDefault();
	}, false);
	document.addEventListener('click', function() {
		if (that.ply.hasgun) that.shootGun();
	}, false);
};

//https://stackoverflow.com/a/4427063
Dachu.prototype.pollInput = function () {
	var self = this;
	window.addEventListener("keydown", function(e) {
	     e = e || window.event;
	     self.ply.keysdown[e.keyCode] = true;
	});

	window.addEventListener("keyup", function(e) {
	     e = e || window.event;
	     delete self.ply.keysdown[e.keyCode];
	});
};
