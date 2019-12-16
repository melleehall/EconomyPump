'use strict';




// Event handlers

function goButton () {
    $('.go').click(function () {
        $('.hero-img').addClass('hide');
        $('.search-view').removeClass('hide');
        console.log(`goButton function ran`)
    });
}

function searchButton () {
    $('.search').click(function () {
        $('.search-view').addClass('hide');
        $('.stats-view').removeClass('hide');
        console.log(`goButton function ran`)
    });
}

function shopButton () {
    $('.shop').click(function () {
        $('.stats-view').addClass('hide');
        $('.shop-view').removeClass('hide');
        console.log(`goButton function ran`)
    });
}

function watchButtons () {
    goButton();
    searchButton();
    shopButton();
}

$(watchButtons)