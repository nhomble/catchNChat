function gotMedia(stream){
	myStream = stream;
	window.stream = stream;
	if(window.URL){
		myVideo.src = window.URL.createObjectURL(stream);
		theirVideo.src = window.URL.createObjectURL(stream);
		getMedia = true;
	}
	else {
		myVideo.src = stream;
		theirVideo.src = window.URL.createObjectURL(stream);
	}
}

function errorGetMedia(e){
	console.log('navigator.getUserMedia() failed miserably');
	console.log(e);
	alert('need to see your face fool');
}

function detectThrow(detector){
	/* improve TODO */
	coords = detector.detect(myVideo, 1);
	if(coords[0]){
		coord = coords[0];
		for(var i = coord.length - 1; i >= 0; i--){
			if(coord[i][4] > coord[4]) coord = coord[i];
		}
		ret = [(coord[0] + coord[2])/2, (coord[1] = coord[3])/2];
		return ret;
	}
	return null;
}

var throwVals = [0, 0, 0, 0, 0];
function updateThrowCanvas(detector){
	var throwCanvas = document.getElementById('throw_canvas');
	var throwCtx = throwCanvas.getContext('2d');
	throwCtx.fillStyle = '#666699';
	throwCtx.fillRect(0, 0, throwCanvas.width, throwCanvas.height);
	throwCtx.beginPath();
	throwCtx.moveTo(throwCanvas.width/2, 0);
	throwCtx.lineTo(throwCanvas.width/2,  throwCanvas.height);
	throwCtx.stroke();

	var coord = detectThrow(detector);
	throwVals.pop();
	if(coord && hasBall){
		throwCtx.beginPath()
		throwCtx.fillStyle = '#FF0000';
		throwCtx.arc(throwCanvas.width/2, coord[1]*vheight / throwCanvas.height, 10, 0, 2*Math.PI, false);
		throwCtx.fill();
		throwCtx.stroke();

		/* check for a throw, just keep cycling throwVals and then see if first and last value have enough of a difference */
		throwVals.unshift(coord[1]);
	}
	else {
		throwVals.unshift(0);
	}
}

function checkForThrow(){
	/* make this better TODO */
	if(hasBall){
		/* check for decrease in height */
		if(throwVals[throwVals.length - 1] < throwVals[0]){
			/* check to see that we are basically decreasing */
			var faults = 0;
			for(var i = throwVals.length - 1; i > 0; i--){
				if(throwVals[i] <= throwVals[i-1] + 20) 
					faults += 1;
			}
			/* so if we are confident.. */
			if(faults < throwVals.length/2){
				alert('throw');
				throwVals = [0, 0, 0, 0, 0];
				/* signal TODO */
			}
		}
	}
}

var catchVals = [0, 0, 0, 0, ];
function detectCatch(detector){
	if(!hasBall){
		/* TODO */
	}
}

function updateCatchCanvas(detector){
	var catchCanvas = document.getElementById('catch_canvas');
	var catchCtx = catchCanvas.getContext('2d');
	catchCtx.fillStyle = '#666699';
	catchCtx.fillRect(0, 0, catchCanvas.width, catchCanvas.height);
	catchCtx.beginPath();
	catchCtx.strokeStyle = 'white'
	catchCtx.arc(catchCanvas.width/2, catchCanvas.height/2, catchRadius, 0, 2*Math.PI, false);
	catchCtx.stroke();

	/* TODO */
}

function checkForCatch(){
	/* TODO */
}

function main(){
	navigator.getUserMedia({ audio: true, video: true }, gotMedia, errorGetMedia);
	/* detectors */
	var hoDetector = new objectdetect.detector(
		~~(vwidth / vheight * 80), 
		~~(vwidth / vheight * 80), 
		1, 
		objectdetect.handopen
	);
	/*
	TODO - problems importing .. dumb
	var hfDetector = new objectdetect.detector(
		~~(vwidth / vheight * 80),
		~~(vwidth / vheight * 80),
		1,
		objectdetect.handfist
	);
	*/

	setInterval(function(){
		updateThrowCanvas(hoDetector);		
		updateCatchCanvas(hoDetector);
		checkForThrow();
		checkForCatch();
	}, 500 );
}
main()
