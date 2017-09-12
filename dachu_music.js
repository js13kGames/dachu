//dachu
//music

Dachu.prototype.gain = function(i) {
	this.gains[i] = this.actx.createGain();
	this.gains[i].connect(this.actx.destination);
	this.gains[i].gain.value = 0.2;
};

Dachu.prototype.fd = function(i) {
	var that = this;
	var thatosc = this.oscs[i];
	var thatgain = this.gains[i];
	thatgain.gain.setTargetAtTime(0, this.actx.currentTime, 0.015);
	setTimeout(function() {
		thatosc.stop();
	}, 100);
}

Dachu.prototype.playSound = function(num, time, inst) {
	if (this.oscs[inst]) {
		if (this.osct[inst] == 0) {
			//this.oscs[inst].stop();
			this.fd(inst);
		} else {
			this.osct[inst]--;
		}
	}
	if (typeof num === "undefined") return;
	if (this.oscs[inst]) {
		console.log("stop");
		this.fd(inst);
	}
	this.gain(inst);
	var osc = this.actx.createOscillator();
	osc.connect(this.gains[inst]);
	osc.type = inst == 2 ? "triangle" : "sine"; //cheap, I know
	osc.frequency.value = Math.pow(Math.pow(2,(1/12)),(num-33))*440;
	console.log(osc.frequency.value);
	this.oscs[inst] = osc;
	this.osct[inst] = time;
	osc.start();
	//osc.stop(this.actx.currentTime+(ms/1000));
};

Dachu.prototype.readMusic = function(str) {
	this.gains = [];
	this.oscs = [];
	this.osct = [];
	this.actx = new(window.AudioContext || window.webkitAudioContext)();
	this.instd = Array(3);
	for (var i=0;i<3;i++) this.instd[i]=Array();
	this.stopmusic = false;

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
			that.playSound(that.instd[k][tick],that.instd[k][tick+1],k);
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
