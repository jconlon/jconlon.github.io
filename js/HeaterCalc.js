/**
 * 
 */

var PREMIER_80 = 80000;
var PREMIER_170 = 170000;
var PREMIER_350 = 350000;
var DIRECTOR_300 = 258700;

function HeaterCalc(unitFactor){
	
	this.unitFactor =unitFactor;
	this.height = 0;
	this.width = 0;
	this.lenght = 0;
	this.tempRise = 0;
	
	this.setDimensions = function(height,width,length){
		this.height = height;
		this.width = width;
		this.lenght = length;
	};

	this.setUnitFactor = function(unitFactor){
		this.unitFactor =unitFactor;
	};
	
	this.setTempRise = function(tempRise){
		this.tempRise =tempRise;
	};
	
	this.volume = function(){
		var volume = this.height * this.width * this.lenght;
		if (isNaN(volume)) { 
			volume = ""; 
	    }
		return volume;
	};
	
	this.btuhReq = function(){
		if(this.volume()==""){
			return "";
		}
		//alert("UnitFactor="+this.unitFactor+" volume="+this.volume() +" tempRise="+this.tempRise);
		return Math.round((this.unitFactor * this.volume()) * this.tempRise);
	};
	
	this.myRound = function(value, places) {
	    var multiplier = Math.pow(10, places);

	    return (Math.round(value * multiplier) / multiplier);
	};
	
	this.suggest = function(heater){
		if(this.btuhReq()==""){
			return "";
		}
		var raw = this.btuhReq()/heater;
		return raw.toFixed(1);
	};

	this.p80 = function(){
		return this.suggest(PREMIER_80);
	};
	
	this.p170 = function(){
		return this.suggest(PREMIER_170);
	};
	
	this.p350 = function(){
		return this.suggest(PREMIER_350);
	};
	
	this.d300 = function(){
		return this.suggest(DIRECTOR_300);
	};
	
}



