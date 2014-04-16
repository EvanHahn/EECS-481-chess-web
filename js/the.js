/* global Parse, ChessBoard, Games */

Parse.initialize('4SV3X5Flt3tqhr87pM29xI36jKYtUWnZWBBI70iH', 'CuVq6V6rVsXC2ud1lGl9U8qStG2zVNySqPktbk35');

var $activities = $('.activity');
var $logOut = $('#log-out');
var $signUp = $('#sign-up');
var $logIn = $('#log-in');
var $usernameTitle = $('#username-title');

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
var $boardTitle = $('#board-title');

var $newGameModal = $('.newgame.modal');
var $opponentName = $('#opponent-name');

var $backButton = $('#backBtn');
var $flipButton = $('#flipBtn');
var $quitButton = $('#quitBtn');
var $randomButton = $('#random-button');

var $board = null;
var $statusEl = $('#status');
var $game = null;

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
    $logIn.hide();
}

function showGame(game) {
	$game = game;
	$activities.hide();
	$boardActivity.show();
    updateStatus(game);
	var yourName = game.myName();
	var oppName = game.otherPlayerName();
	var titleStatus = yourName + ' vs. ' + oppName;
	$boardTitle.html(titleStatus);

	if (game.isOver()){
		$quitButton.hide();
	}
	else {
		$quitButton.show();
	}

	$board = new ChessBoard('board', {
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
			$board.draggable = game.isMyTurn();
			if (!move)
				return 'snapback';
			game.save(null, {
				success: $.noop,
				error: function() {
					alert('Error making move. Try again!');
				}

			});

			if(oppName === 'Computer') {
				console.log('lol');
				window.setTimeout(makeRandomMove(game), 250);
				game.save(null, {
					success: $.noop,
					error: function() {
						alert('Error making move. Try again!');
					}
				});
			}
            updateStatus(game);


		},
		onMouseoutSquare: onMouseoutSquare,
	  	onMouseoverSquare: onMouseoverSquare,
		onSnapEnd: function() {
			$board.position(game.get('gameHistory'));
		}
	});

}

function showGameList(user) {
	$activities.hide();
	$logOut.show();
	$gameList.show();
    $signUp.hide();
    $logIn.hide();
	
	var username = user.get('username');
	
	$usernameTitle.html('Username: ' + username);
	$usernameTitle.show();

	$yourTurnGamesList.html('');
	$theirTurnGamesList.html('');
	$finishedGamesList.html('');

	

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

function deleteGame(game){
	game.destroy({
		success: function(game){
		},
		error: function(game, error){
		}
	});
}

function updateStatus(game) {
    var status = '';
    var playerName = '';
    if (game.isMyTurn() === true) {
        playerName = game.myName();
      }
    else {
        playerName = game.otherPlayerName();
    }

    status = 'It is ' + playerName + '\'s turn to move';

	// checkmate?
      if (game.in_checkmate() === true) {
		  status = 'Game over, ' + playerName + ' is in checkmate.';
		  $quitButton.hide();
      }
      // draw?
      else if (game.in_draw() === true) {
		  status = 'Game over, drawn position';
		  $quitButton.hide();
      }
      // game still on
      else {
        status = playerName + ' to move';
        // check?
        if (game.in_check() === true) {
          status += ', ' + playerName + ' is in check';
        }
      }

    if (game.isOver() === true){
//        status = 'Game is over'
    }

    $statusEl.html(status);
}

$registerForm.on('submit', function(event) {

	event.preventDefault();
	var username = $usernameInput.val();
	var password = $passwordInput.val();

	Parse.User.logIn(username, password, {
		success: function(user) {
			var stuff = 'Username: ' + username;
			$usernameTitle.html(stuff);
			showGameList(user);
		},
		error: function(user, error) {
            var status = '';
            status = "Error: " + error.code + " " + error.message;
            $registerFormAlert.html(status);
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
            $usernameInput = $usernameInput2;
            showGameList(user);
        },
        error: function(user, error) {
//            $signUpFormAlert.alert();
            var status = '';
            status = "Error: " + error.code + " " + error.message;
            $signUpFormAlert.html(status);
            $signUpFormAlert.show();
        }
    });
});

$logOut.on('click', function(event) {
	event.preventDefault();
	Parse.User.logOut();
	$usernameTitle.hide();
	showRegister();
});

$logIn.on('click', function(event) {
	event.preventDefault();
    $signUpForm.hide();
    $signUpFormAlert.hide();
	showRegister();
});

$signUp.on('click', function(event) {
	event.preventDefault();
    $registerForm.hide();
    $signUpForm.show();
    $signUpFormAlert.hide();
    $logIn.show();
    $signUp.hide();
});


$newGameModal.on('submit', function(event) {

	event.preventDefault();

	var me = Parse.User.current().get('username').toLowerCase();
	var opponent = $opponentName.val().toLowerCase();

	if (me == opponent) {
		$opponentName.parent().addClass('has-error');
		return;
	}

	var userCheck = new Parse.Query('User');
	userCheck.equalTo('username', opponent);
	userCheck.find({

		success: function (users) {
			if (users.length) {
				createGame(me, opponent);
				$newGameModal.modal('hide');
			} else {
				$opponentName.parent().addClass('has-error');
			}
		},

		error: function () {
			$opponentName.parent().addClass('has-error');
		}

	});

});

function createGame(me, opponent){
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
		$opponentName.val('');
	},
	error: function(game, error) {
		alert('Error starting new game: ' + error.description);
		}
	});
};


$randomButton.on('click', function(event) {
	event.preventDefault();
	var me = Parse.User.current().get('username');
	var opponent = 'Computer';
	createGame(me, opponent);
});


$backButton.on('click', function(event) {
	event.preventDefault();
    var currentUser = Parse.User.current();
    showGameList(currentUser);
});

$flipButton.on('click', function(event) {
    event.preventDefault();
    $board.flip();
});

$quitButton.on('click', function(event) {
    event.preventDefault();
	$game.destroy({
		success: function(game){
			var currentUser = Parse.User.current();
			showGameList(currentUser);
		},
		error: function(game, error){
			var currentUser = Parse.User.current();
			showGameList(currentUser);
		}
	});

});

//Chess board grey square
var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);

  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};


var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
	var moves = $game.moves(square);

	// exit if there are no moves available for this square
	if (moves.length === 0) return;

	// highlight t	he square they moused over
	greySquare(square);

	// highlight the possible squares for this piece
	for (var i = 0; i < moves.length; i++) {
	greySquare(moves[i].to);
	}
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var makeRandomMove = function(game) {
  	var possibleMoves = game.moves();
  // game over
  	if (possibleMoves.length === 0) return;
	var randomIndex = Math.floor(Math.random() * possibleMoves.length);
	game.move(possibleMoves[randomIndex]);
//	$board.position(game.fen());
};

$(document).on('ready', function() {
  	$logOut.removeClass('hide');
	var currentUser = Parse.User.current();
	if (currentUser)
		showGameList(currentUser);
	else
		showRegister();
});
