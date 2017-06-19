'use strict'

function getFile (url) {
  return new Promise(function (resolve, reject) {
    var fake_responses = {
		  'file1': 'The first text',
		  'file2': 'The middle text',
		  'file3': 'The last text'
	  }
    var randomDelay = (Math.round(Math.random() * 1E4) % 8000) + 1000

    console.log('Requesting: ' + url)

    function anon () {
      resolve(fake_responses[url])
    }
    setTimeout(anon.bind(this), randomDelay)
  })
}

// request all files at once in "parallel"
getFile('file1')
.then(function (file1) {
  console.log(file1)
  return getFile('file2')
})
.then(function (file2) {
  console.log(file2)
  return getFile('file3')
})
.then(function (file3) {
  console.log(file3)
  console.log('Complete!')
})
