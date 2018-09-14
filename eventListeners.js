

(function ($) {

	var
		body = document.body,
		msgbox = document.getElementById("msgbox"),
		log = document.getElementById("log");


	// form submit handler
	msgbox.addEventListener("submit", SendMessage, false);


	// newMessage event subscribers
	document.addEventListener("newMessage", newMessageHandler, false);
	body.addEventListener("newMessage", newMessageHandler, false);
	msgbox.addEventListener("newMessage", newMessageHandler, false);

	// newMessage event handler
	function newMessageHandler(e) {
		LogEvent(
			"Event subscriber on " + e.currentTarget.nodeName + ", "
			+ e.detail.time.toLocaleString() + ": " + e.detail.message
		);
	}


	// new message: raise newMessage event
	function SendMessage(e) {

		e.preventDefault();
		var msg = document.getElementById("msg").value.trim();

		if (msg && window.CustomEvent) {
			var event = new CustomEvent("newMessage", {
				detail: {
					message: msg,
					time: new Date(),
				},
				bubbles: true,
				cancelable: true
			});

			e.currentTarget.dispatchEvent(event);
		}

	}

	// "msg" is custom event type  
	//		detail: a child object providing custom info    
	//		bubbles: if true, events bubble to ancestors of 
	//						 element that fired event               
	//		cancelable: if true, event can be canceled with 
	//							stopPropagation() method              
	var txtFirstName_Click = new CustomEvent("newMessage", {
		detail: {
			message: "XXXXXXX",
			time: new Date(),
		},
		bubbles: true,
		cancelable: true

	});

	// log event in console
function LogEvent(msg) {
	log.textContent += msg + "\n";
	var ot = log.scrollHeight - log.clientHeight;
	if (ot > 0) log.scrollTop = ot;
}

	document.getElementById("msgbox").dispatchEvent(event);

	$('txtFirstName').click(function () { alert('hi'); });

})(jQuery);
