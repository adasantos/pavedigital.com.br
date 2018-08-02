function getIpAddress() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://jsonip.com");
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				window.ip = JSON.parse(xhr.responseText).ip
				firebase.database().ref("tracking").push({
					ip: window.ip,
					timestamp: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
					url: window.location.href
				})
			} else {
				getIpAddress()
			}
		}
	}
	xhr.send()
}

function subscribe(name, email) {
	firebase.database().ref("leads").push({
		ip: window.ip,
		timestamp: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss"),
		name: name,
		email: email
	})
}

if (document.querySelector("#formModal")) {
	document.querySelector("#formModal").addEventListener("submit", function(event) {
		event.preventDefault()
		subscribe(document.querySelector("#nameModal").value, document.querySelector("#emailModal").value)
		$("#modal").modal("hide")
	})
}

document.querySelector("#form").addEventListener("submit", function(event) {
	event.preventDefault()
	subscribe(document.querySelector("#name").value, document.querySelector("#email").value)
	document.querySelector("#form").classList.add("d-none")
	document.querySelector("#alert").classList.remove("d-none")
})

if (document.querySelector("a[href='#formulario']")) {
	document.querySelector("a[href='#formulario']").addEventListener("click", function() {
		setTimeout(function() {
			document.getElementById("name").focus()
		}, 100)
	})
}

document.addEventListener("DOMContentLoaded", function (event) {
	firebase.initializeApp({
		apiKey: "AIzaSyA4j9ZAfoXdozRG51c_p3EMJYZvN-vkfDw",
		authDomain: "pave-digital.firebaseapp.com",
		databaseURL: "https://pave-digital.firebaseio.com",
		projectId: "pave-digital",
		storageBucket: "pave-digital.appspot.com",
		messagingSenderId: "611260857595"
	})

	getIpAddress()
})