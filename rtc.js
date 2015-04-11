var datachannel = new DataChannel();
datachannel.userid = window.userid;

// Storage of Pusher connection socket ID
var socketId;

// Pusher.log = function(message) {
//   if (window.console && window.console.log) {
//     window.console.log(message);
//   }
// };

// Monitor Pusher connection state
pusher.connection.bind("state_change", function(states) {
	switch (states.current) {
		case "connected":
	        socketId = pusher.connection.socket_id;
		    break;
		case "disconnected":
		case "failed":
		case "unavailable":
		    break;
	}
});

datachannel.openSignalingChannel = function(config) {
	var channel = config.channel || this.channel || "default-channel";
	var xhrErrorCount = 0;
	var socket = {
		send: function(message){
			$.ajax({
				type: "POST",
				url: "/message",
				data: {
					socketId: socketId,
					channel: channel,
					message: message
				},
				timeout: 1000,
				success: function(data) {
					xhrErrorCount = 0;
				},
				error: function(xhr, type){
					xhrErrorCount++;
					if(xhrErrorCount > 5){
						console.log("disabling signaller due to connection failure");
						datachannel.transmitRoomOnce = true;
					}
				}
			});
		},
		channel: channel
	};
	var pusherChannel = pusher.subscribe(channel);
	pusherChannel.bind("pusher:subscription_succeeded", function(){
		if (config.callback) config.callback(socket);
	});

	pusherChannel.bind("message", function(message){
		config.onmessage(message);
	});
	return socket;
};

</script>

<script>
var datachannel = new DataChannel();
datachannel.userid = window.userid;

// Storage of Pusher connection socket ID
var socketId;

// Pusher.log = function(message) {
//   if (window.console && window.console.log) {
//     window.console.log(message);
//   }
// };

// Monitor Pusher connection state
pusher.connection.bind("state_change", function(states) {
	switch (states.current) {
		case "connected":
	        socketId = pusher.connection.socket_id;
		    break;
		case "disconnected":
		case "failed":
		case "unavailable":
		    break;
	}
});

