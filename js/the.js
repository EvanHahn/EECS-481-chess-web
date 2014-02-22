/* global Parse */

Parse.initialize('4SV3X5Flt3tqhr87pM29xI36jKYtUWnZWBBI70iH', 'CuVq6V6rVsXC2ud1lGl9U8qStG2zVNySqPktbk35');

var $activities = $('.activity');
var $registerForm = $('#register-form');
var $registerFormAlert = $('.alert', $registerForm);
var $gameList = $('#game-list');
var $yourTurnGamesList = $('#your-turn-games');
var $theirTurnGamesList = $('#their-turn-games');
var $finishedGamesList = $('#finished-games');
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

	var username = user.get('username');

	var player1Query = new Parse.Query('Games');
	player1Query.equalTo('player1Name', username);
	var player2Query = new Parse.Query('Games');
	player2Query.equalTo('player2Name', username);
	var query = Parse.Query.or(player1Query, player2Query);
	query.find({
		success: function(games) {

			games.forEach(function(game) {

				var $bullet = $('<li></li>');
				var $link = $('<a href="#"></a>');
				$link.text('Versus ' + game.otherPlayerName());
				$link.on('click', function(event) {
					event.preventDefault();
					console.log(game.id);
				});

				$bullet.append($link);

				if (game.isOver())
					$finishedGamesList.append($bullet);
				else if (game.isMyTurn())
					$yourTurnGamesList.append($bullet);
				else
					$theirTurnGamesList.append($bullet);

			});

		},
		error: function(error) {
			alert('Error refreshing games. Please try refreshing.');
			console.error(error);
		}
	});

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
