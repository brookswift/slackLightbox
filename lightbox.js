// personal api key for this test app, please don't copy
const API_KEY = 'c912c92d3a30a7833836c26b56c01a22';

// base search api endpoint for the flickr image search
const SEARCH_API = 'https://api.flickr.com/services/rest/?method=flickr.photos.search';

// hardcoding query size to 72
const PER_PAGE = 72;

// image size coding from flickr
const IMAGE_SIZES = {
  small: 's', // size s is 75px
  large: 'n' // size n is 320px
}

// to get a clean json response, both format and nojsoncallback must be specified
const API_SETTINGS = `per_page=${PER_PAGE}&format=json&nojsoncallback=1&api_key=${API_KEY}`;

let lightbox = (function () {
  let imageData = []; // this array will maintain our current data store from the latest query
  let imgIndex = 0; // this is the currently selected index for the detail image view

  // initializing the commonly usedDOM selectors here so that they are just grabbed once
  let lightboxBackgroundEl;
  let lightboxEl;
  let detailImageEl;
  let galleryEl;
  let errorEl;

  /*********************
   * Helper Functions
   *********************/

  /* constructs a url for fetching the image from flickr
   * @param {object} image - the image obj returned by the flickr api for an individual images
   * @param {string} size - the size to return - "small" or "large"
   * @return {url} - a valid flickr image url
   */
  function getImageUrl(image, size) {
    return `https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}_${IMAGE_SIZES[size]}.jpg`;
  }

  /*
   * @param {string} query - the query to run against the flickr api to generate the gallery
   * @return {array} - returns an array of photo objects from the flickr api
   */
  function photoSearch(query) {
    var url = `${SEARCH_API}&tags=${query}&${API_SETTINGS}`;
    return fetch(url, {mode:'cors'}).then(function (response) {
      if (response.status === 200) {
        return response.json();
      } else {
        displayError(`Request Error: ${response.status}: ${response.statusText}`);
      }
    }).then(function (respBody) {
      if (!respBody) {
        displayError(`Invalid server response`);
      } else if (respBody.stat !== 'ok') {
        displayError(`Flickr API Error: ${respBody.stat}`);
      } else {
        imageData = respBody.photos.photo; // store the current query's photos
        return respBody.photos.photo;
      }
      return []; // return a blank array if the request failed
    });
  }

  /* displays any errors
   *
   */
  function displayError(str) {
    errorEl.innerHTML = str;
    errorEl.classList.add('show');
  }

  /*
   * loops through the images array from the latest query and generates html
   * which is then appended to the DOM. No events are registered on these elements
   * so it's safe to just overrite them without worrying about dangling handlers
   */
  function renderGallery() {
    let imagesContentArr = []
    imageData.forEach((image) => {
      let imgUrlS = getImageUrl(image, 'small');
      let imgUrlL = getImageUrl(image, 'large');
      imagesContentArr.push(`<a href="${imgUrlL}"><img src="${imgUrlS}"></a>`);
    });
    galleryEl.innerHTML = imagesContentArr.join('\n');
  }

  /* loads the detailed image view by updating the title and img src
   * @param {integer} i - the index of the image to load into the detail view
   */
  function loadDetailImage(i) {
    let imgUrl = getImageUrl(imageData[i], 'large');
    document.querySelector('.lightbox-detail h2').innerHTML = imageData[i].title;
    document.querySelector('.lightbox-detail img').src = imgUrl;
    // once the contents are updated, go ahead an make the lighbox and background visible
    lightboxBackgroundEl.classList.add('visible');
    lightboxEl.classList.add('visible');
  }

  /*********************
   * Event Handlers
   *********************/

  function onSubmit(e) {
    e.preventDefault();
    // use the placeholder for the initial query and to handle an empty form submit
    // note: I'm using DOM 0 here because it's a very efficient way to do form manipulation in vanillaJS
    // without having to search the DOM in a more traditional route
    let query = document.forms.searchForm.elements.photoSearch.value || document.forms.searchForm.elements.photoSearch.placeholder;
    photoSearch(query).then(function (images) {
      renderGallery();
    });
  }

  function onClickThumbnail(e) {
    let linkEl = e.target.parentNode;

    e.preventDefault(); // since these are links, we have to prevent their default behavior

    // this a lookup of the index of the link which we can then reference to our
    // images array from the server. Since .children is not an array, we first
    // have to transform it to an array so that we can use indexOf to determine
    // the index of the link element in our gallery.
    let index = [].slice.call(this.children).indexOf(linkEl);
    imgIndex = index;
    loadDetailImage(index);
  }

  // handles clicking the lightbox, which covers the whole screen and hides both
  // the lightbox and the background transparency overlay. Lighbox is a parent
  // of the prev and next buttons, so it won't recieve a click event when clicking
  // on either button because the event propagation is stopped in their handlers.
  // This prevents the lightbox from closing when you are navigating with the buttons.
  function onClickLightbox(e) {
    lightboxBackgroundEl.classList.remove('visible');
    this.classList.remove('visible');
  }

  // handles clicking the prev caret < in the detail view
  function onClickPrev(e) {
    e.preventDefault();
    e.stopPropagation();

    if (imgIndex > 0) {
      imgIndex --;
      loadDetailImage(imgIndex);
    } else {
      imgIndex = imageData.length - 1;
      loadDetailImage(imgIndex);
    }
  }

  // handles clicking the next caret > in the detail view
  function onClickNext(e) {
    e.preventDefault();
    e.stopPropagation();

    if (imgIndex < imageData.length - 1) {
      imgIndex ++;
      loadDetailImage(imgIndex);
    } else {
      imgIndex = 0;
      loadDetailImage(imgIndex);
    }
  }

  return {
    onDomReady: function initLightbox() {
      // make these dom elements available to the module once dom content is loaded
      lightboxBackgroundEl = document.getElementsByClassName('lightbox-background')[0];
      lightboxEl = document.getElementsByClassName('lightbox')[0];
      detailImageEl = document.querySelector('.lightbox-detail img');
      galleryEl = document.getElementsByClassName('gallery')[0];
      errorEl = document.getElementsByClassName('error')[0];

      // this is a delegated event handler that catches click events on the individual gallery
      // elements.
      document.getElementsByClassName('gallery')[0].addEventListener('click', onClickThumbnail);
      document.getElementsByClassName('lightbox')[0].addEventListener('click', onClickLightbox);
      document.getElementsByClassName('prev')[0].addEventListener('click', onClickPrev);
      document.getElementsByClassName('next')[0].addEventListener('click', onClickNext);
      document.getElementById('searchForm').addEventListener('submit', onSubmit);

      onSubmit({preventDefault: () => {}}); // initial query running the form handler with a null event
    },
    onLoad: function initAnimation() {
      let lightboxBackgroundEl = document.getElementsByClassName('lightbox-background')[0];
      let lightboxEl = document.getElementsByClassName('lightbox')[0];

      lightboxBackgroundEl.classList.remove('loading');
      lightboxEl.classList.remove('loading');
    }
  }
})();

// The regular DOMContentLoaded event is where we initialize the event handlers
// and send our initial query to load the gallery
document.addEventListener("DOMContentLoaded", function () {
  lightbox.onDomReady();
});

// Due to how CSS3 transitions work, we have to wait until the window's load event
// before un-hiding the lightbox elements so that the transitions do not execute
// on page load. The .loading class is just 'display:none', which prevents the
// transitions from running
window.addEventListener("load", function () {
  lightbox.onLoad();
})
