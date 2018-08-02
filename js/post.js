function subscribe(url) {
	let data = {
		ip: window.ip,
		timestamp: moment().tz("America/Sao_Paulo").format("YYYY-MM-DD HH:mm:ss")
	}
	if (url) {
		data.url = url
		firebase.database().ref("tracking").push(data)
	} else {
		data.name = document.querySelector("#name").value
		data.email = document.querySelector("#email").value
		firebase.database().ref("leads").push(data)
		document.querySelector("form").classList.add("d-none")
		document.querySelector("#alert").classList.remove("d-none")
	}
}

function getIpAddress() {
	let xhr = new XMLHttpRequest();
	xhr.open("GET", "https://jsonip.com");
	xhr.onreadystatechange = () => {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				window.ip = JSON.parse(xhr.responseText).ip
				subscribe(window.location.href)
			} else {
				getIpAddress()
			}
		}
	}
	xhr.send()
}

document.querySelector("form").addEventListener("submit", function (event) {
	event.preventDefault()
	subscribe()
})

if (document.querySelector("a[href='#formulario']")) {
	document.querySelector("a[href='#formulario']").addEventListener("click", function() {
		setTimeout(function() {
			document.getElementById("name").focus()
		}, 500)
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