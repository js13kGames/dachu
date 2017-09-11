//dachu
//music

Dachu.prototype.playSound = function(num, ms, inst) {
	this.oscs.push(osc);
	if (typeof num === "undefined") return;
	var osc = this.actx.createOscillator();
	osc.connect(this.actx.destination);
	osc.type = inst == 2 ? "triangle" : "sine"; //cheap, I know
	osc.frequency.value = Math.pow(Math.pow(2,(1/12)),(num-33))*440;
	osc.start();
	osc.stop(this.actx.currentTime+(ms/1000));
};

Dachu.prototype.readMusic = function(str) {
	this.actx = new(window.AudioContext || window.webkitAudioContext)();
	this.instd = Array(3);
	for (var i=0;i<3;i++)this.instd[i]=Array();
	this.stopmusic = false;
	this.oscs = [];

	var wait = parseInt(str.slice(0,3));
	var loopend = parseInt(str.slice(3,5));
	var loopstart = parseInt(str.slice(5,7));
	var data = this.decompressString(str.substring(7));
	var inst = 0;
	var mode = 0;
	var seek = 0;
	for(var i=0;i<data.length;i++)data[i]=data[i]-1;
	for(var j=0;j<data.length;j+=2) {
		if (data[j]==50) {
			inst = data[j+1];
			seek = 0;
		} else if (data[j]==51) {
			mode = data[j+1];
		} else if (data[j]==52) {
			seek += data[j+1]*3;
		} else {
			this.instd[inst][seek] = data[j];
			this.instd[inst][seek+1] = data[j+1];
			this.instd[inst][seek+2] = mode;
			seek += 3*data[j+1];
		}
	}

	var that = this;
	var tick = 0;
	var id = setInterval(function() {
		for(var k=0;k<3;k++) {
			that.playSound(that.instd[k][tick],180*that.instd[k][tick+1],k);
		}
		tick+=3;
		if(tick>loopend*3*16)tick=loopstart*3*16;
		if(that.stopmusic) {
			that.instd = Array(3);
			for (var i=0;i<3;i++)that.instd[i]=Array();
			tick = 0;
			that.stopmusic = false;
			clearInterval(id);
		}
	}, wait);
};
