function save(userId) {
	let data = {
		ip: window.ip,
		timestamp: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss")
	}
	if (userId) data.userId = userId
	else {
		data.name = $("#name").val()
		data.email = $("#email").val()
	}
	
	firebase.database().ref("leads").push(data)
	$("form").addClass("d-none")
	$("#alert").removeClass("d-none")
}

$("form").submit(function(e) {
	e.preventDefault()
	save()
})

$(document).ready(function() {
	firebase.initializeApp({
		apiKey: "AIzaSyA4j9ZAfoXdozRG51c_p3EMJYZvN-vkfDw",
		authDomain: "pave-digital.firebaseapp.com",
		databaseURL: "https://pave-digital.firebaseio.com",
		projectId: "pave-digital",
		storageBucket: "pave-digital.appspot.com",
		messagingSenderId: "611260857595"
	})

	$.get("https://jsonip.com", (data) => {
		window.ip = data.ip
		let url = window.location.href.split("?")
		if (url.length == 2) save(url[1])
	})
})