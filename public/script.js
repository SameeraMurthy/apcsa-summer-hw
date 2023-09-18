const socket = io()
const room = location.pathname.split("/").pop()
const user = localStorage.getItem("user") ?? "Anonymous"; // Use saved username or be anonymous

socket.emit("join", {room, user}) // Tell everyone else that you joined
$("#roomLabel").text(`#${room}`) // Change the room title
$("#exit").click(() => location.replace("/")); // Exit button functionality
socket.on("announcement", data => {
    $("#main").append(`<div class="my-2 text-center italic text-gray-300"><span class="font-bold">${data.user}</span> ${data.action} the room.</div>`);
    $("#main").animate({ scrollTop: $('#main').prop("scrollHeight")}, 1000);
})

socket.on("message", data => {
    $("#main").append(`<div class="mb-4 w-72 mr-auto ml-0 block">
	<div class="ml-1 text-sm italic text-gray-300">${data.user} - ${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</div>
	<div class="rounded-xl break-words bg-zinc-800 px-3 p-2 w-fit mb-1">${data.message}</div>
	</div>`);
    $("#main").animate({ scrollTop: $('#main').prop("scrollHeight")}, 1000); // Scroll Down
})

$(window).on('unload', () => socket.emit("disconnects", {room, user})) // Tell everyone if someone leaves or gets disconnected

$("#form").submit((e) => {
	e.preventDefault()
	let payload = {
		message: $("#box").val().trim(),
		user: user,
		room: room
	}
	if (payload.message != "") {
		$("#main").append(`<div class="mb-4 max-w-xs w-72 ml-auto mr-0 block flex flex-col">
		<div class="text-right mr-1 text-sm italic text-gray-300">You - ${new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</div>
		<div class="self-end rounded-xl break-words bg-blue-700 px-3 p-2 w-fit mb-1 max-w-xs">${payload.message}</div>
		</div>`);
		socket.emit("message", payload)
		$("#box").val("");
		$("#box").focus();
		$("#main").animate({ scrollTop: $('#main').prop("scrollHeight")}, 1000); // Scroll Down
	}
})