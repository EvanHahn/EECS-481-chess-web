// jshint undef: false

Parse.initialize('4SV3X5Flt3tqhr87pM29xI36jKYtUWnZWBBI70iH', 'CuVq6V6rVsXC2ud1lGl9U8qStG2zVNySqPktbk35');

var $activities = $('.activity');
var $registerForm = $('#register-form');
var $gameList = $('#game-list');

$registerForm.on('submit', function(event) {

	event.preventDefault();
	var username = $('#user-name').val();
	var password = $('#password').val();

	Parse.User.logIn(username, password, {
		success: function(user) {
			$activities.hide();
			$gameList.show();
		},
		error: function(user, error) {
			alert('You did not log in successfully');
		}
	});

});

var currentUser = Parse.User.current();
if (currentUser) {
	$gameList.show();
} else {
	$registerForm.show();
}
