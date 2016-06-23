// this is a test for branches

var map;

function initMap() {
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map-div'), {
        center: { lat: 40.277187, lng: -75.914540 },
        scrollwheel: true,
        zoom: 8
    });

    var infowindow = new google.maps.InfoWindow();



    function fqAnswer() {
        $('#fq-text').text('FOOTER');
        setTimeout(function() {
            $('#fq-text').text('');
        }, 5000);
    }




}

/* ---  --- */

$(document).ready(function() {

    var searchIcon = $('#search-icon');
    var menuIcon = $('#menu-icon');
    var refreshIcon = $('#refresh');
    var mapDiv = $('#mapdiv');
    var searchDiv = $('#search-div');
    var inputDiv = $('#fq-search');


    var wHidden = true;

    dropIcon.click(function() {

        if (wHidden == true) {
            dropIcon.toggleClass('rotate');
            wHidden = false;
        } else {
            dropIcon.toggleClass('rotate');
            wHidden = true;
        }

    });

    var cWidth = $(window).width();

    if (cWidth <= 992) {
        setTimeout(function() {
            mapDiv.hide();
        }, 500);
    }


    searchIcon.click(function() {
        mapDiv.hide('fast');
        searchDiv.show('fast');
        inputDiv.show('fast');
        refreshIcon.hide('fast');
    });

    menuIcon.click(function() {
        mapDiv.show('fast');
        searchDiv.hide('fast');
        inputDiv.hide('fast');
        refreshIcon.show('fast');
    });

    refreshIcon.click(function() {
        map.setZoom(5);
    });

    $(window).resize(function() {

        var cWidth = $(window).width();

        if (cWidth > 992) {
            mapDiv.show();
            searchDiv.show();
            inputDiv.show();
            refreshIcon.show();
        }

    })

});

// Main Angular Application
var App = angular.module("myApp", []);

// Master Angular Controller
App.controller('masterCtrl', function($scope) {

    $(document).keyup(function(e) {

        if (e.keyCode == 13) {
            if ($('#query').is(':focus') || $('#query-city').is(':focus')) {
                $scope.loadPlaces();
            }
        }
    });

    //	Loads FourSquare from user input
    $scope.loadPlaces = function() {

        console.log("Load Places Clicked");

        var query = "pizza";
        var City = $('#query-city').val();

        //Checking Inputs

        if (City == '') {
            alert('City field is/was left blank. Please input a valid location.');
            return;
        };

        $scope.q1 = query + ' in ';
        $scope.q2 = City;


        var apiURL = 'https://api.foursquare.com/v2/venues/search?client_id=N1IAMKZUIK1AUHKRFGFBKPQ2YKDSBAKS4NTER5SYZN5CROR1&client_secret=4MKLXVLU2FGZQVRMAEDC15P0TFJGSCY3ZUYUZ0KHQQQLQ5R3&v=20130815%20&limit=1000&near=' + City + '&query=' + query + '';
        console.log(apiURL);

        $scope.places = [];

        $.getJSON(apiURL, function(data) {
            console.log(data);

            var venues = data.response.venues.length;

            //Refreshes Map
            map = new google.maps.Map(document.getElementById('map-div'), {
                center: { lat: data.response.venues[1].location.lat, lng: data.response.venues[1].location.lng },
                scrollwheel: true,
                stylers: [{ "visibility": "simplified" }],
                zoom: 9
            });








            // Loops through JSON and saves data
            for (var i = 0; i < venues; i++) {

                var venue = data.response.venues[i];

                if (venue.location.address == undefined) {
                    continue;
                }

                //Adds places to array
                $scope.places.push({
                    placeName: venue.name,
                    placeID: venue.id,
                    placeAddress: venue.location.address,
                    placeCity: venue.location.city,
                    placeState: venue.location.state,
                    placeLat: venue.location.lat,
                    placeLng: venue.location.lng,
                })

            }

            $scope.addMarker($scope.places);
            console.log('done push');
            $scope.$apply(function() {
                console.log($scope.places);
            });

        });




        $('#query-city').val('');
    }

    $scope.mapMarkers = [];

    $scope.addMarker = function(array) {

        $.each(array, function(index, value) {

            var infowindow = new google.maps.InfoWindow();

            var infoBox = '<div class="gmData img-rounded" style="padding: 10px;">' +
                '<h4>' + value.placeName + '</h4>' +
                '<p>' + value.placeAddress + '<br>' + value.placeCity + ', ' + value.placeState  + '<br>' + 
                '<strong><div class="votes" id="votes">' + 
                '<i data-name="' + value.placeName + '" data-venueid="' + value.placeID + 
                '" class="fa fa-thumbs-down" aria-hidden="true"></i><span id="downCount"></span></div>' + 
                '<div class="votes" id="votes">' + 
                '<i data-name="' + value.placeName + '" data-venueid="' + value.placeID + '" class="fa fa-thumbs-up" aria-hidden="true"></i><span id="upCount"></span></div></strong>' + '</div>';

            var image = 'http://i.imgur.com/H9fvwBc.png';
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(value.placeLat, value.placeLng),
                title: value.placeName,
                id: value.placeID,
                animation: google.maps.Animation.DROP,
                map: map,
                icon: image
            });
            marker.addListener('click', function() {
                console.log('Marker Animation');
                if (marker.getAnimation() !== null) {
                    marker.setAnimation(null);
                } else {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
                setTimeout(function() {
                    marker.setAnimation(null)
                }, 1500);
            });

            $scope.mapMarkers.push({
                marker: marker,
                content: infoBox
            });

            google.maps.event.addListener(marker, 'click', function() {
                console.log('click function working');
                infowindow.setContent(infoBox);
                map.setZoom(13);
                map.setCenter(marker.position);
                infowindow.open(map, marker);
                map.panBy(0, -125);
            });
        });
    }



    $scope.showMarker = function(string) {

        console.log(string);
        var infowindow = new google.maps.InfoWindow();
        var clickedItem = string.place.placeID;

        for (var key in $scope.mapMarkers) {
            if (clickedItem === $scope.mapMarkers[key].marker.id) {
                map.panTo($scope.mapMarkers[key].marker.position);
                map.setZoom(13);
                infowindow.setContent($scope.mapMarkers[key].content);
                infowindow.open(map, $scope.mapMarkers[key].marker);
                map.panBy(0, 125);
            }
        }
    }



    $scope.filterResults = function() {

        var input = $('#place-filter').val().toLowerCase();
        console.log(input);
        var list = $scope.places;
        if (input == '' || !input) {
            $.each($scope.mapMarkers, function(index, item) {
                $scope.mapMarkers[index].marker.setMap(map);
            })
            return;
        } else {
            for (var i = 0; i < list.length; i++) {
                if (list[i].placeName.toLowerCase().indexOf(input) != -1) {
                    $scope.mapMarkers[i].marker.setMap(map);
                } else {
                    $scope.mapMarkers[i].marker.setMap(null);
                }
            }
        }
    }

    $scope.showMessage = function() {
        console.log("MouseOver Working.");

        $('#fq-text').text('Click any list item to show its location on the map.');
        setTimeout(function() {
            $('#fq-text').text('');
        }, 3000);
    }
});



function fqAnswer() {
    $('#fq-text').text('search a city, filter the resutlts, upvote or downvote your favorites');
    setTimeout(function() {
        $('#fq-text').text('');
    }, 5000);
}
//firebase authentication
var chatRef = new Firebase("https://njpizzashowdown.firebaseIO.com");
var chat = new FirechatUI(chatRef, document.getElementById("firechat-wrapper"));
chatRef.onAuth(function(authData) {
    if (authData) {
        chat.setUser(authData.uid, "Anonymous" + authData.uid.substr(10, 8));
    } else {
        chatRef.authAnonymously(function(error, authData) {
            if (error) {
                console.log(error);
            }
        });
    }

    //accordion collapse functions
    $('.accIcon').html('<i class="fa fa-arrow-up accIcon" aria-hidden="true"></i>');

    $('#collapseOne').on('show.bs.collapse', function() {

        $('.accIcon').html('<i class="fa fa-arrow-down accIcon" aria-hidden="true"></i>');
        $('.panel-heading').animate({
            backgroundColor: "#515151"
        }, 500);
    })

    $('#collapseOne').on('hide.bs.collapse', function() {
        $('.accIcon').html('<i class="fa fa-arrow-up accIcon" aria-hidden="true"></i>');
        $('.panel-heading').animate({
            backgroundColor: "#00B4FF"
        }, 500);
    })



});
// thumbs up and thumbs down firebase 
var clickCounter = [];  
    

    $(document).on('click', '.fa-thumbs-up', function() {
            var icon = $(this);
            var venueId = icon.attr('data-venueid');
            var venueName = icon.attr('data-name');
            console.log('venueId', venueId);
            var clickData = new Firebase("https://thinking-outloud.firebaseio.com/" + venueId);
    
            clickData.transaction(function(venue) {
                if (venue) {
                    venue.name = venueName;
                    venue.rating++;
                    return venue;
                } else {
                    return {
                        name: venueName,
                        rating: 1
                    }
                }                
            });


    });

    var pizzaDatabase = new Firebase("https://thinking-outloud.firebaseio.com/");




    $('#generateChart').on('click', function() {

    });



    $(document).on('click', '.fa-thumbs-down', function() {
            var icon = $(this);
            var venueId = icon.attr('data-venueid');
            var venueName = icon.attr('data-name');
            console.log('venueId', venueId);
            var clickData = new Firebase("https://thinking-outloud.firebaseio.com/" + venueId);

            clickData.transaction(function(venue) {
                if (venue) {
                    venue.name = venueName;
                    venue.rating--;
                    return venue;
                } else {
                    return {
                        name: venueName,
                        rating: 0
                    }
                }                
            });

    });