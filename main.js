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

const searchURLCensus = 'http://api.census.gov/data/timeseries/poverty/saipe';

const searchURLEtsy = 'https://openapi.etsy.com/v2/listings/active/.js';

const etsyKey1 = 'xo3uhc5fmp9o';

const etsyKey2 = '275kczo2uef6';

const usMedianIncome = 63179;

// Display-Related Functions

function modifyStatsView (responseJson) {
    $('.js-selected-state').text(responseJson[1][0]);
    $('.js-state-median').text(responseJson[1][1]);

    const percent = compareIncomes(responseJson);
    
    if (percent > 0) {
      $('.percent').text(percent);
      $('.highlow').text('higher');
      $('.highlow').addClass('green');
    } else {
      const posPercent = Math.abs(percent);
      $('.percent').text(posPercent);
      $('.highlow').text('lower');
      $('.highlow').addClass('red');
    };   
}

function modifyShopsView (responseJson) {
  console.log(`modifyShopsView is running`);
}


// Pure US HH Income-Related Functions

function compareIncomes (responseJson) {
    const stateInc = responseJson[1][1];
    const percent = Math.round(((stateInc - usMedianIncome) / stateInc) * 100);
    return percent;
}


// need to figure out how to get a return value for HH income out of this promise (revisit this)

// function generateUSHHIncome() {
//     let states = Object.keys(storeFIPS);
//     let incomes = [];
//     for (let i=0; i < states.length; i++) {
//         let code = storeFIPS[states[i]];
//         const url = getURL(code);
//         fetch(url)
//       .then(response => {
//         if (response.ok) {
//           return response.json();
//         }
//           throw new Error(response.statusText);
//         })
//         .then(function(responseJson) {
//           const income = responseJson[1][1];
//           incomes.push(income);
//           console.log(incomes);
//         }) 
//         .catch(err => {
//           $('#js-error-message').text(`Something went wrong: ${err.message}`);
//       })
//     };
//     console.log(`${incomes} outside of the promise`)
// }

// $(generateUSHHIncome)
    
// API Calling Functions

function getHHIncomeDisplay(url) {
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

function getEtsyShops(url) {
  console.log(`getEtsyShop fetch function running`);
  fetch(url, {mode: "no-cors"})
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => modifyShopsView(responseJson))
  .catch(err => {
    $('#js-error-message').text(`Something went wrong: ${err.message}`);
});
}

// URL Generating Functions

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${key}=${params[key]}`);
  return queryItems.join('&');
}

function getURLCensus(query) {
    const params = {
      time: 2018,
      get: 'NAME,SAEMHI_PT',
      for: `state:${query}`
    };
  
    const queryString = formatQueryParams(params);
    const url = searchURLCensus + '?' + queryString;
    
    return url;
  }

function getURLEtsy(query) {
  const params = {
    location: query,
    callback: getData,
    api_key: etsyKey1 + etsyKey2
  };

  const queryString = formatQueryParams(params);
  const url = searchURLEtsy + '?' + queryString;
    
  return url;
}

// Event Handlers

function goButton () {
    $('.go').click(function () {
        $('.hero-img').addClass('hide');
        $('.search-view').removeClass('hide');
    });
}

function searchButton () {
    $('.search').click(function () {
        const place = $('.places').val();

        // Access the FIPS code for the selected state and pass it as the argument to the US Census API
        const urlCensus = getURLCensus(storeFIPS[place]);
        getHHIncomeDisplay(urlCensus);
      
        // Make a call to Etsy API in the background with the selected state to populate stores - don't show them yet
        const urlEtsy = getURLEtsy(place)

        console.log(`Etsy API URL is ${urlEtsy}`);
        $('.js-etsy-url').attr('src', urlEtsy);


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