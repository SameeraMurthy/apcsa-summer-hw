$("#user").val(localStorage.getItem("user") ?? "")

// Generates a random room ID
const random = (characters, l) => {
    let result = ''
    for (let i = l; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]
    return result
}

$("#join").submit((e) => {
	e.preventDefault()
	localStorage.setItem("user", $("#user").val())
    location.replace(`/${($("#room").val().trim() != "") ? $("#room").val().trim() : random('0123456789abcdefghijklmnopqrstuvwxyz', 6)}`)
})