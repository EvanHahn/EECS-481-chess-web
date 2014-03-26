the web part of Graceful Chess
==============================

Made for University of Michigan's EECS 481.

Visit the site here:

<http://www-personal.umich.edu/~evanhahn/graceful-beta/>

Or run it in a local web server.

Running an HTTP server with Python 2 (works on Mac OSX and Ubuntu Linux):

    python -m SimpleHTTPServer
    open http://localhost:8000

Running an HTTP server with Python 3:

    python -m http.server
    # open http://localhost:8000 in your browser

If you're on Windows, you can try WAMP or Apache Tomcat.

If you're on Linux, you probably already know how to do this.

Some notes:

- We didn't want a build step, so this thing makes too many HTTP requests and resources aren't minified. Sorry!
