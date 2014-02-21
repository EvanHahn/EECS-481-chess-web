// jshint undef: false

Parse.initialize('4SV3X5Flt3tqhr87pM29xI36jKYtUWnZWBBI70iH', 'CuVq6V6rVsXC2ud1lGl9U8qStG2zVNySqPktbk35');

var $activities = $('.activity');
var $registerForm = $('#register-form');
var $registerFormAlert = $('.alert', $registerForm);
var $gameList = $('#game-list');
var $logOut = $('#log-out');

function showRegister() {
	console.assert(!Parse.User.current());
	$activities.hide();
	$logOut.hide();
	$registerFormAlert.hide();
	$registerForm.show();
}

function showGameList(user) {
	$activities.hide();
	$logOut.show();
	$gameList.show();
}

$registerForm.on('submit', function(event) {

	event.preventDefault();

	var form = $(this).serializeObject();
	var username = form.username;
	var password = form.password;

	Parse.User.logIn(username, password, {
		success: function(user) {
			showGameList(user);
		},
		error: function() {
			$registerFormAlert.show();
		}
	});

});

$logOut.on('click', function(event) {
	event.preventDefault();
	Parse.User.logOut();
	showRegister();
});

$(document).on('ready', function() {
	var currentUser = Parse.User.current();
	if (currentUser)
		showGameList(currentUser);
	else
		showRegister();
});

