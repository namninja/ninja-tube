const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyClU_CyBAIHdrxQZz1btz2NhFMn_JYg7oI';

// get input from user
function watchSubmit() {
// listen for search event
$('.js-search-form').submit(event => {
  // override default behavior
  event.preventDefault();
  // store user input and log it
  const userInput = $('.js-query').val()
  console.log(userInput)
  // add Ninja to user input and log it
  const ninjaQuery = `${userInput} Ninjas`
  console.log(ninjaQuery)
  // clear out the input
  $('.js-query').val("");
  // get data from API
  getDataFromApi(ninjaQuery, displaySearchData);
})
}


// get data
function getDataFromApi(searchTerm, callback) {
const settings = {
  url: YOUTUBE_SEARCH_URL,
  data: {
    part: 'snippet',
    key: API_KEY,
    q: `${searchTerm}`,
    maxResults: '4',
    type: 'video'
  },
  dataType: 'json',
  type: 'GET',
  success: callback
};
$.ajax(settings);
}

// transform the data
function renderResult(result) {
console.log(result);
return `
  <div class="col-6 js-video-thumb video-thumb">
    <div class="js-video-thumb video-thumb">
      <a href="https://www.youtube.com/watch?v=${result.id.videoId}">
        <img src="${result.snippet.thumbnails.medium.url}" class="thumbnail-image" alt="${result.snippet.title}">
      </a>
      <p class="video-title">${result.snippet.title}</p>
      <a href="https://www.youtube.com/channel/${result.snippet.channelId}" target="_blank" class="more-channel">More From This Channel
      </a>
    </div>
  </div>
`;
}

// manipulate the DOM
function displaySearchData(data) {
const results = data.items.map((item, index) => renderResult(item));
$('.js-search-results').html(results);
}
$(watchSubmit)