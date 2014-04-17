/**
 * 
 */

var METRIC_UNITS = 8.454221213;
var FEET_UNITS = 0.266;// Changed for issue 9 from 0.133;

var Units = new Object();
Units[0] = FEET_UNITS;
Units[1] = METRIC_UNITS;

var BTUHREQWORDS = [ "Btuh's", "Watts" ];
var btuhReqWord = BTUHREQWORDS[0];

// Celsius to Fahrenheit
var DEGREE_ABR = [ "F", "C" ];

var TEMP_OPTIONS = [ populate_fahrenheit_options, populate_celsius_options ];

// Create the HeatCalc Feet and Fahrenheit
var c = new HeaterCalc(Units[0]);

window.onload = init;

function init() {
	// Add listeners to select elements
	var unitSelect = document.getElementById("unitSelect");
	unitSelect.addEventListener("change", changeUnits, false);
	var tempRiseSelect = document.getElementById("riseSelect");
	tempRiseSelect.addEventListener("change", compute, false);

	// Add listeners to the spatial inputs
	var f = document.volumecalc_form; // This is the form we'll we working
										// with;
	f.height.addEventListener("change", compute, false);
	f.width.addEventListener("change", compute, false);
	f.length.addEventListener("change", compute, false);
	window.addEventListener("load",function(){hideAddressBar();});
	window.addEventListener("orientationchange",function(){hideAddressBar();});
}

function changeUnits() {
	// get the spatial measurementUnit
	var unitSelectObj = document.getElementById("unitSelect");
	var unitSelectObjIndex = unitSelectObj.selectedIndex;
	var spaceUnitValue = unitSelectObj[unitSelectObjIndex].value;
	var spaceUnitText = unitSelectObj[unitSelectObjIndex].text;
    btuhReqWord = BTUHREQWORDS[unitSelectObjIndex];
	var unitFactor = Units[unitSelectObjIndex];
	c.setUnitFactor(unitFactor);
	// Change all space Units to Feet or Meters
	changeMeasurementUnitNames(spaceUnitValue, "spaceUnits");
	changeMeasurementUnitNames(spaceUnitText, "spaceUnitsName");

	// Empty the tempRiseSelect element
	var tempRiseSelectObj = document.getElementById("riseSelect");
	// Remove the listener to prevent triggering events
	// tempRiseSelectObj.removeEventListener("change",compute,false);
	// Empty the tempRiseSelect element of options
	tempRiseSelectObj.options.length = 0;
	// Get the function to add temperature options based on the unitSelect index
	// (Feet = 0 and Meters = 1)
	var targetTempf = TEMP_OPTIONS[unitSelectObjIndex];
	targetTempf(tempRiseSelectObj);
	// Add the listener back in
	// tempRiseSelectObj.addEventListener("change",compute,false);

	// change temp measurement Units a
	changeMeasurementUnitNames(DEGREE_ABR[unitSelectObjIndex], "tempUnits");
	compute();
}

function populate_fahrenheit_options(select) {
	select.options[select.options.length] = new Option('°5', 5);
	select.options[select.options.length] = new Option('°10', 10);
	select.options[select.options.length] = new Option('°20', 20);
	select.options[select.options.length] = new Option('°30', 30);
	select.options[select.options.length] = new Option('°40', 40);
	select.options[select.options.length] = new Option('°50', 50);
	select.options[select.options.length] = new Option('°60', 60);
	select.options[select.options.length] = new Option('°70', 70);
	select.options[select.options.length] = new Option('°80', 80);
	select.options[select.options.length] = new Option('°90', 90);
	select.options[select.options.length] = new Option('°100', 100);
	select.options[6].selected = true;
}

function populate_celsius_options(select) {
	select.options[select.options.length] = new Option('°2.5', 2.5);
	select.options[select.options.length] = new Option('°5', 5);
	select.options[select.options.length] = new Option('°7.5', 7.5);
	select.options[select.options.length] = new Option('°10', 10);
	select.options[select.options.length] = new Option('°12.5', 12.5);
	select.options[select.options.length] = new Option('°15', 15);
	select.options[select.options.length] = new Option('°17.5', 17.5);
	select.options[select.options.length] = new Option('°20', 20);
	select.options[select.options.length] = new Option('°22.5', 22.5);
	select.options[select.options.length] = new Option('°25', 25);
	select.options[select.options.length] = new Option('°27.5', 27.5);
	select.options[select.options.length] = new Option('°30', 30);
	select.options[select.options.length] = new Option('°32.5', 32.5);
	select.options[select.options.length] = new Option('°35', 35);
	select.options[select.options.length] = new Option('°37.5', 37.5);
	select.options[select.options.length] = new Option('°40', 40);
	select.options[3].selected = true;
}

// This function computes the suggested heater and updates all the elements in
// the form.
// It is triggered whenever anything changes, and makes sure that
// all elements of the form contains legal values and are consistent.
function compute() {

	var f = document.volumecalc_form; // This is the form we'll we working
										// with;

	// line 1, height
	var height = parseFloat(f.height.value);
	if (isNaN(height)) {
		height = 0;
		f.height.value = "";
	} else {
		f.height.value = height;
	}

	// line 2, width
	var width = parseFloat(f.width.value);
	if (isNaN(width)) {
		width = 0;
		f.width.value = "";
	} else {
		f.width.value = width;
	}

	// Line 3: length
	var length = parseFloat(f.length.value);
	if (isNaN(length)) {
		length = 0;
		f.length.value = "";
	} else {
		f.length.value = length;
	}

	// get the selected temp value
	var tempRiseSelectObj = document.getElementById("riseSelect");
	var tempRiseIndex = tempRiseSelectObj.selectedIndex;
	var tempRise = tempRiseSelectObj[tempRiseIndex].value;

	c.setDimensions(height, width, length);
	c.setTempRise(tempRise);

	// Volume
	var volumeElement = document.getElementById("volume");
	var volume = c.volume();
	if (volume == "" || volume == 0) {
		volumeElement.innerHTML = "";
	} else {
		volumeElement.innerHTML = addCommas(volume);
	}

	// heat Requirements
	var btuhReqNumElement = document.getElementById("btuhReqNumber");
	var btuhReqWordElement = document.getElementById("btuhReqWord");
	var btuhs = c.heatReq();
	if (btuhs == "") {
		btuhReqNumElement.innerHTML = "";
		btuhReqWordElement.innerHTML = "";
	} else {
		btuhReqNumElement.innerHTML = addCommas(btuhs);
		//Feet - Bthu's
		btuhReqWordElement.innerHTML = btuhReqWord;
	}

	// Suggestions

	// Heaters

	// "p80", "p170", "p350", "d300"
	var element = document.getElementById("p80");
	element.innerHTML = c.p80();

	element = document.getElementById("p170");
	element.innerHTML = c.p170();

	element = document.getElementById("p350");
	element.innerHTML = c.p350();

	element = document.getElementById("d300");
	element.innerHTML = c.d300();

}

/**
 * 
 * @param name
 *            of MeasurementUnit
 */
function changeMeasurementUnitNames(name, clz) {
	var x = document.getElementsByClassName(clz);

	var arrayLength = x.length;
	for (var i = 0; i < arrayLength; i++) {
		x[i].innerHTML = name;
	}
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function hideAddressBar(){
	  if(document.documentElement.scrollHeight<window.outerHeight/window.devicePixelRatio)
	    document.documentElement.style.height=(window.outerHeight/window.devicePixelRatio)+'px';
	  setTimeout(window.scrollTo(1,1),0);
}
	