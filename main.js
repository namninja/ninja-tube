const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyClU_CyBAIHdrxQZz1btz2NhFMn_JYg7oI';
const search = {
  nextPageToken: null,
  searchTerms: null,
  results: 0,
  totalResults: 0
}
// get input from user
function watchSubmit() {
  // listen for search event
  $('.js-search-form').submit(event => {
    // override default behavior
    event.preventDefault();
    // store user input and log it
    search.nextPageToken = 0
    search.results = 0
    const userInput = $('.js-query').val()
    console.log(userInput)
    // add Ninja to user input and log it
    const ninjaQuery = `${userInput} Ninjas`
    search.searchTerms = ninjaQuery
    search.nextPageToken = null
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
      maxResults: '2',
      type: 'video',
      pageToken: search.nextPageToken
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
      <a data-fancybox="gallery" href="https://www.youtube.com/watch?v=${result.id.videoId}">
        <img src="${result.snippet.thumbnails.high.url}" class="thumbnail-image" alt="${result.snippet.title}">
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
  search.nextPageToken = data.nextPageToken
  search.results += data.pageInfo.resultsPerPage
  search.totalResults = data.pageInfo.totalResults
  if (search.totalResults === 0) {
    $('.js-results-heading').html('No Results, Please try again');
    $('.js-search-results').html('');
    $('.js-next-results').addClass('hidden');
  } else {
    console.log(search.nextPageToken)
    const results = data.items.map((item, index) => renderResult(item));
    $('.js-results-heading').removeClass('hidden');
    $('.js-results-heading').html('Results: ' + search.results + ' / ' + search.totalResults);
    $('.js-next-results').removeClass('hidden');
    $('.js-search-results').html(results);
  }
}

// listen for more button event
function handleMoreVideos() {
  // listen for event
  $('.js-next-form').on('click', '.js-next-results', (event) => {
    // override default behavior
    event.preventDefault();
    // log event
    console.log('handleMoreVideos ran')
    getDataFromApi(search.searchTerms, displaySearchData);
  })
}



function handleNinjaSearch() {
  watchSubmit();
  handleMoreVideos();

}
$(handleNinjaSearch)
