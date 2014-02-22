/* exported Games */
/* global Parse */

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
		this.set('gameHistory', chessJSGame.fen());
		return result;
	}

});
