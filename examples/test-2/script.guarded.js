var catchall = catchall || {
  onerror: function(err) {
    try {
      console.error(err.stack);
    } catch (e) {
      catchall.onerror(e);
    }
  }
};

if (typeof catchall != "undefined") {
  catchall.onerror = function(e) {
    try {
      console.error("An error has occurred!");
      console.error(e.stack);
    } catch (e) {
      catchall.onerror(e);
    }
  };
}

function badFunction() {
  try {
    unknownFunction();
  } catch (e) {
    catchall.onerror(e);
  }
}

badFunction();