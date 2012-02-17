
### Motivation

- Better alternative to `window.onerror`. Actually catches *all* exceptions thrown in JavaScript.
- Catch errors where they originate from.
- Ability to send errors to a server while alpha testing.
- Insipired by [proxino](https://www.proxino.com/).

### Features

- Scripts are cached until they're modified.
- Connect Module - Example: `http://localhost/catchall/js/something.js`, or `http://localhost/catchall/http://somesite.com/js/script.js`


### Super Important Note

All function bodies are wrapped in try-catch blocks, so it would be a **terrible** idea to use this for production code.

## Example

Create a file called `script.js`:

```javascript

//only catch all if functions have been wrapped around
if(typeof catchall != 'undefined') {

	//on catch all, send error to server
	catchall.error = function(e) {
		console.error('An error has occurred!');
		console.error(e.message);
	}	
}


function badFunction() {
	unknownFunction();
}

badFunction();

```

In terminal, type:

```bash
catchall -i ./script.js -o ./script.guarded.js
node ./script.guarded.js
```

The message you should see is:

```
An error has occurred!
unknownFunction is not defined
```

## Command Line Usage

```bash
Usage: -i [input_js]

Options:
  -i, --input   input js file or url  [required]
  -o, --output  output js file      
```

## Connect Middleware


```javascript
var catchall = require('catchall'),
connect = require('connect'),
app = connect.createServer();
app.use(catchall.connectMiddleware);
app.use(connect.static(__dirname + '/public'));
app.listen(8080);
```

Here's how you'd use catchall in html:

```html
<html>
	<head>

		<!-- jquery lib wrapped around try-catch blocks -->
		<script type="text/javascript" src="http://localhost:8080/catchall/http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js"></script>
	</head>
	<body>
	</body>
</html>
```

## API


### catchall.wrap(source[, ops], callback)

Generates guarded code where all exceptions are caught.

- `source` - the javascript source to wrap around.
- `ops` - the wrap options.
	- `addHandler` - add the handler at the head of the script (`catchall.error = function(){}`)

Here's a simple example:

```javascript

var catchall = require('catchall');

catchall.wrap('function test(){ notDefined(); }', function(err, wrappedSource) {
	//do stuff
});
```

The above script will produce:

```javascript
function test() {
	try {
		notDefined();
	} catch(e) {
		catchall.error(e);
	}
}
```

### catchall.load(source, callback)

Loads the given source, and wraps around it. Can be from fs, or url.

Example:

```javascript
catchall.load('http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.js', function(err, result) {
	//do something
});

catchall.load('/from/fs', function(err, result) {
	//do something
});
```






