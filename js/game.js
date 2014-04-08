/* exported Games */
/* global Parse, Chess */

var Games = Parse.Object.extend('Games', {

	otherPlayerName: function() {
		var me = Parse.User.current();
		console.assert(me);
		var myName = me.get('username');
		if (this.get('player1Name') == myName)
			return this.get('player2Name');
		else
			return this.get('player1Name');
	},
	myName: function(){
		return Parse.User.current().get('username');
	},
	isMyTurn: function() {
		var me = Parse.User.current();
		console.assert(me);
		var myName = me.get('username');
		var currentPlayer = this.get('gameStatus');
		return myName == currentPlayer;
	},

	isOver: function() {
		return this.get('gameStatus') == 'gameover';
	},

	move: function() {
		var chessJSGame = new Chess(this.get('gameHistory'));
		var result = chessJSGame.move.apply(this, arguments);
		if (result) { // is the move valid?
			this.set('gameHistory', chessJSGame.fen());
			if (chessJSGame.game_over()) {
				this.set('gameStatus', 'gameover');
			} else if (this.get('gameStatus') == this.get('player1Name')) {
				this.set('gameStatus', this.get('player2Name'));
			} else {
				this.set('gameStatus', this.get('player1Name'));
			}
		}
		return result;
	},
	
	
	moves: function(square){
		var chessJSGame = new Chess(this.get('gameHistory'));
		var result = '';
		if (square == undefined) {
			result = chessJSGame.moves();
		}
		else {
			result = chessJSGame.moves({
				square: square,
				verbose: true
			});
		}
		return result;
	},
	fen: function () {
		var chessJSGame = new Chess(this.get('gameHistory'));
		return chessJSGame.fen();
	}

});
