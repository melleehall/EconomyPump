'use strict';

// Stored data

// US Census Bureau API uses 2 digit FIPS State Codes for location parameter
const storeFIPS = {
   "Alabama"                :  "01",
   "Alaska"                 :  "02",
   "Arizona"                :  "04",
   "Arkansas"               :  "05",
   "California"             :  "06",
   "Colorado"               :  "08",
   "Connecticut"            :  "09",
   "Delaware"               :  "10",
   "District of Columbia"   :  "11",
   "Florida"                :  "12",
   "Geogia"                 :  "13",
   "Guam"                   :  "66",
   "Hawaii"                 :  "15",
   "Idaho"                  :  "16",
   "Illinois"               :  "17",
   "Indiana"                :  "18",
   "Iowa"                   :  "19",
   "Kansas"                 :  "20",
   "Kentucky"               :  "21",
   "Louisiana"              :  "22",
   "Maine"                  :  "23",
   "Maryland"               :  "24",
   "Massachusetts"          :  "25",
   "Michigan"               :  "26",
   "Minnesota"              :  "27",
   "Mississippi"            :  "28",
   "Missouri"               :  "29",
   "Montana"                :  "30",
   "Nebraska"               :  "31",
   "Nevada"                 :  "32",
   "New Hampshire"          :  "33",
   "New Jersey"             :  "34",
   "New Mexico"             :  "35",
   "New York"               :  "36",
   "North Carolina"         :  "37",
   "North Dakota"           :  "38",
   "Ohio"                   :  "39",
   "Oklahoma"               :  "40",
   "Oregon"                 :  "41",
   "Pennsylvania"           :  "42",
   "Rhode Island"           :  "44",
   "South Carolina"         :  "45",
   "South Dakota"           :  "46",
   "Tennessee"              :  "47",
   "Texas"                  :  "48",
   "Utah"                   :  "49",
   "Vermont"                :  "50",
   "Virginia"               :  "51",
   "Washington"             :  "53",
   "West Virginia"          :  "54",
   "Wisconsin"              :  "55",
   "Wyoming"                :  "56"
};

// store api key and endpoint

const searchURL = 'http://api.census.gov/data/timeseries/poverty/saipe';

// Display-Related Functions

function modifyStatsView (responseJson) {
    $('.js-selected-state').text(responseJson[1][0]);
    $('.js-state-median').text(responseJson[1][1]);
}

// Calculate Median HH Income for US

function getMedianHHIncome(query) {
    const params = {
      time: 2018,
      get: 'NAME,SAEMHI_PT',
      for: `state:${query}`
    };
  
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => modifyStatsView(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
  }

function usMedianHHIncome () {
    let states = Object.keys(storeFIPS);
    const usHHAccumulator = 0;
    for (let i=0; i < states.length; i++) {
        let code = storeFIPS[states[i]];
        console.log(code);

        // call US census api with FIPS code for each state and add med HH income returned to total
    }
    // return usHHAccumulator / states.length;
}

$(usMedianHHIncome);

// API Call-Related functions

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${key}=${params[key]}`)
    return queryItems.join('&');
  }


  // need a different function for the accumulator - want to add returned value to total, not display stats
  function fetchCensusData (url) {
    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => modifyStatsView(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
  }

function getMedianHHIncome(query) {
    const params = {
      time: 2018,
      get: 'NAME,SAEMHI_PT',
      for: `state:${query}`
    };
  
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;
    console.log(url);
  
    fetchCensusData(url);
  }



// Event handlers

function goButton () {
    $('.go').click(function () {
        $('.hero-img').addClass('hide');
        $('.search-view').removeClass('hide');
    });
}

function searchButton () {
    $('.search').click(function () {
        const place = $('.places').val();
        // Access the FIPS code for the selected state and pass it as the argument
        getMedianHHIncome(storeFIPS[place]);
        // geolocation API will be called with this value and lat/long will be returned and stored for use by Etsy API if needed for shop location param
        $('.search-view').addClass('hide');
        $('.stats-view').removeClass('hide');
    });
}

function shopButton () {
    $('.shop').click(function () {
        $('.stats-view').addClass('hide');
        $('.shop-view').removeClass('hide');
    });
}

function watchButtons () {
    goButton();
    searchButton();
    shopButton();
}

$(watchButtons)