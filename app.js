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
  return get(url).then(JSON.parse).catch(function(err) {
    console.log("getJSON failed for", url, err);
    throw err;
  });
}

var storyPromise;

function getChapter(i) {
  storyPromise = storyPromise || getJSON('story.json');

  return storyPromise.then(function(story) {
    return getJSON(story.chapterUrls[i]);
  });
}

// getChapter(0).then(function(chapter) {
//   console.log('Chapter 1: ' + chapter);
//   return getChapter(1);
// }).then(function(chapter) {
//   console.log('Chapter 2: ' + chapter);
// }, function(error) {
//   console.error('Failure! ' + error);
// });

getJSON('story.json').then(function(story) {
  return getJSON(story.chapterUrls[0]);
}).then(function(chapter1) {
  addHtmlToPage(chapter1.html);
}).catch(function() {
  addTextToPage("Failed to show chapter");
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
});