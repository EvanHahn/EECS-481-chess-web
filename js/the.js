/* global Parse, ChessBoard, Games */

Parse.initialize('4SV3X5Flt3tqhr87pM29xI36jKYtUWnZWBBI70iH', 'CuVq6V6rVsXC2ud1lGl9U8qStG2zVNySqPktbk35');

var $activities = $('.activity');
var $logOut = $('#log-out');
var $signUp = $('#sign-up');

var $registerForm = $('#register-form');
var $registerFormAlert = $('.alert', $registerForm);
var $signUpForm = $('#signup-form');
var $signUpFormAlert = $('.alert', $signUpForm);
var $usernameInput = $('input[name="username"]');
var $passwordInput = $('input[name="password"]');

var $usernameInput2 = $('input[name="username2"]');
var $passwordInput2 = $('input[name="password2"]');

var $gameList = $('#game-list');
var $yourTurnGamesList = $('#your-turn-games');
var $theirTurnGamesList = $('#their-turn-games');
var $finishedGamesList = $('#finished-games');

var $boardActivity = $('#board-activity');

var $newGameModal = $('.newgame.modal');
var $opponentName = $('#opponent-name');

function showRegister() {
	console.assert(!Parse.User.current());
	$activities.hide();
	$logOut.hide();
	$usernameInput.val('');
	$passwordInput.val('');
	$registerFormAlert.hide();
	$registerForm.show();
    $signUp.show();
    $signUpForm.hide();
}

function showGame(game) {

	$activities.hide();
	$boardActivity.show();

	var board = new ChessBoard('board', {
		position: game.get('gameHistory'),
		draggable: game.isMyTurn(),
		onDragStart: function() {
			if (game.isOver() || !game.isMyTurn())
				return false;
		},
		onDrop: function(source, target) {
			var move = game.move({
				from: source,
				to: target,
				promotion: 'q'
			});
			board.draggable = game.isMyTurn();
			if (!move)
				return 'snapback';
			game.save(null, {
				success: $.noop,
				error: function() {
					alert('Error making move. Try again!');
				}
			});
		},
		onSnapEnd: function() {
			board.position(game.get('gameHistory'));
		}
	});

}

function showGameList(user) {

	$activities.hide();
	$logOut.show();
	$gameList.show();
    $signUp.hide();

	$yourTurnGamesList.html('');
	$theirTurnGamesList.html('');
	$finishedGamesList.html('');

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
					showGame(game);
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

	var username = $usernameInput.val();
	var password = $passwordInput.val();

	Parse.User.logIn(username, password, {
		success: function(user) {
			showGameList(user);
		},
		error: function() {
			$registerFormAlert.show();
		}
	});

});

$signUpForm.on('submit', function(event) {

	event.preventDefault();

    var user = new Parse.User();
    user.set('username', $usernameInput2.val());
    user.set('password', $passwordInput2.val());

    user.signUp(null, {
        success: function(user) {
            showGameList(user);
        },
        error: function() {
        // Show the error message somewhere and let the user try again.
            $signUpFormAlert.show();
        }
    });

});

$logOut.on('click', function(event) {
	event.preventDefault();
	Parse.User.logOut();
	showRegister();
});

$signUp.on('click', function(event) {
	event.preventDefault();
//	Parse.User.logOut();
	showRegister();
    $activities.hide();
    $signUpForm.show();
    $signUpFormAlert.hide();
});

$newGameModal.on('submit', function(event) {

	event.preventDefault();

	var me = Parse.User.current().get('username');
	var opponent = $opponentName.val();

  var game = new Games();
  game.set({
    gameHistory: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    gameStatus: me,
    player1Name: me,
    player2Name: opponent
  });

  game.save(null, {
    success: function(game) {
      showGame(game);
      $newGameModal.modal('hide');
      $opponentName.val('');
    },
    error: function(game, error) {
      alert('Error starting new game: ' + error.description);
    }
  });

});

$(document).on('ready', function() {
	var currentUser = Parse.User.current();
	if (currentUser)
		showGameList(currentUser);
	else
		showRegister();
});
