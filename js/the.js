Parse.initialize('4SV3X5Flt3tqhr87pM29xI36jKYtUWnZWBBI70iH', 'CuVq6V6rVsXC2ud1lGl9U8qStG2zVNySqPktbk35');

$('#register-form').on('submit', function(event) {

	event.preventDefault();
	var username = $('#user-name').val();
	var password = $('#password').val();
	
	Parse.User.logIn(username, password, {
		success: function(user) {
			alert('You logged in successfully');
		},
	    error: function (user, error) {
	    	// body...
	    	alert('You did not log in successfully');
	    }
	})
});