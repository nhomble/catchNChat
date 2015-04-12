/* get my video instantly */
var myVideo = document.querySelector('#my_video');
var theirVideo = document.querySelector('#their_video');

/* depends on who created the channel */
var hasBall = false;

function gotMedia(stream){
	window.stream = stream;
	if(window.URL){
		myVideo.src = window.URL.createObjectURL(stream);
		theirVideo.src = window.URL.createObjectURL(stream);
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

function detectThrow(){

}

function updateThrowCanvas(){
	var throwCanvas = document.getElementById('throw_canvas');
	var throwCtx = throwCanvas.getContext('2d');
	throwCtx.fillRect(0, 0, throwCanvas.width, throwCanvas.height);
	throwCtx.beginPath();
	throwCtx.moveTo(throwCanvas.width/2, 0);
	throwCtx.lineTo(throwCanvas.width/2,  throwCanvas.height);
	throwCtx.stroke();

	var coord = detectThrow();
}

function updateCatchCanvas(){
	var catchCanvas = document.getElementById('catch_canvas');

}

function main(){
	navigator.getUserMedia({ audio: false, video: true }, gotMedia, errorGetMedia);

	setInterval(function(){
		updateThrowCanvas();		
	}, 500 );
}
