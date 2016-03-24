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
  addHtmlToPage(story.heading);

  // Map our array of chapter urls to
  // an array of chapter json promises.
  // This makes sure they all download parallel.
  return story.chapterUrls.map(getJSON)
    .reduce(function(sequence, chapterPromise) {
      // Use reduce to chain the promises together,
      // adding content to the page for each chapter
      return sequence.then(function() {
        // Wait for everything in the sequence so far,
        // then wait for this chapter to arrive.
        return chapterPromise;
      }).then(function(chapter) {
        addHtmlToPage(chapter.html);
      });
    }, Promise.resolve());
}).then(function() {
  addTextToPage("All done");
}).catch(function(err) {
  // catch any error that happened along the way
  addTextToPage("Argh, broken: " + err.message);
}).then(function() {
  document.querySelector('.spinner').style.display = 'none';
});

function addTextToPage(text) {
  console.log('Adding text to page: ' + text);
}