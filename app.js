function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // XHR
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      if(req.status == 200) {
        // Resolve the promise
        resolve(req.response);
      } else {
        // Reject the promise
        reject(req.statusText);
      }
    };

    req.onerror = function() {
      reject(Error("Network Error"));
    };

    req.send();
  });
}

function getJSON(url) {
  return get(url).then(JSON.parse);
}

// Use the get funcion defined above
// get returns a promise, thus it's thenable
getJSON('story.json').then(function(response) {
  console.log('JSON: ' + response);
}, function(error) {
  console.error('Failure! ' + error);
});