
 //Global Variables 
 

// Creates a global map marker
var map;

// Creates a Global variable for all of the locations
var Location;

// Declaring Global clientID & secret for Foursquare API
var clientID;
var clientSecret;

// Default Locations that are displayed on the map
var defaultLocations = [
    {
        name: 'Bishop Cotton Girls School',
        lat: 12.970116869308466, long: 77.60109173306331
    },
    {
        name: 'Pars Persian Restaurant',
        lat: 13.025971487663105, long: 77.6371542926423
    },
    {
        name: 'Savoury Restaurant',
        lat: 12.999503910015576, long: 77.61588670688414
    },
    {
        name: 'Hotel Shalimar Bar and Restaurant',
        lat: 12.978253448591232, long: 77.63736833055371
    },
    {
        name: 'Polo Club - The Oberoi',
        lat: 12.973457334267048, long: 77.61828850236205
    }
];


 //Foursquare API
 
Location = function(data) {
    var self = this;
    this.name = data.name;
    this.lat = data.lat;
    this.long = data.long;
    this.URL = '';
    this.street = '';
    this.city = '';
    this.phone = '';

    // By default every marker will be visible
    this.visible = ko.observable(true);

    // Foursquare API credentials.
    clientID = '2WJFRV3MWWNRRA5PJIHBAZA4OJSD0HPJGTDWPLQ0HOVU1ACH';
    clientSecret = 'KWG3TI1DPNYBX1X3YFXKK24C22HM1YXPKWI4XDF5C2RYUMRX';

    // Foursquare API url
    var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20170413' + '&query=' + this.name;

    // Gets the data from foursquare and store it into its' own variables.
    $.getJSON(foursquareURL).done(function (data) {
        var results = data.response.venues[0];
        self.URL = results.url;
        if (typeof self.URL === 'undefined') {
            self.URL = "";
        }
        self.street = results.location.formattedAddress[0] || 'No Address Provided';
        self.city = results.location.formattedAddress[1] || 'No Address Provided';
        self.phone = results.contact.phone || 'No Phone Provided';
        if(self.phone == 'No Phone Provided') {
        	self.phone = '';
        }
    }).fail(function () {
        $('.list').html('There was an error with the Foursquare API call. Please refresh the page and try again to load Foursquare data.');
    });

    // This is what the infowindow will contain when clicked.
    this.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
        '<div class="content"><a href="' + self.URL + '">' + self.URL + "</a></div>" +
        '<div class="content">' + self.street + "</div>" +
        '<div class="content">' + self.city + "</div>" +
        '<div class="content">' + self.phone + "</div></div>";

    // Puts the content string inside infowindow.
    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    // Places the marker to it's designed location on the map along with it's title.
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.long),
        map: map,
        title: data.name
    });

    // Only makes the one selected marker visible.
    this.showMarker = ko.computed(function() {
        if(this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

    // When marker is clicked on open up infowindow designated to the marker with it's information.
    this.marker.addListener('click', function(){
        self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.name + "</b></div>" +
            '<div class="content"><a href="' + self.URL +'">' + self.URL + "</a></div>" +
            '<div class="content">' + self.street + "</div>" +
            '<div class="content">' + self.city + "</div>" +
            '<div class="content"><a href="tel:' + self.phone +'">' + self.phone +"</a></div></div>";

        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);

        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
    });

    // Makes the marker bounce animation whenever clicked.
    this.bounce = function(place) {
        google.maps.event.trigger(self.marker, 'click');
    };
};

//viewmodel
function ViewModel(){

    var self = this;

    //Holds value for list togglings
    this.toggle = ko.observable('hide');

    // Search term is blank by default
    this.filterTerm = ko.observable('');

    // Initializes a blank array for locations
    this.locationList = ko.observableArray([]);

    // Create a styles array to use with the map.
    var styles = [{
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{"color": "#f7f1df"}]
    }, {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [{"color": "#d0e3b4"}]
    }, {
        "featureType": "landscape.natural.terrain",
        "elementType": "geometry",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "poi.medical",
        "elementType": "geometry",
        "stylers": [{"color": "#fbd3da"}]
    }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{"color": "#bde6ab"}]
    }, {
        "featureType": "road",
        "elementType": "geometry.stroke",
        "stylers": [{"visibility": "off"}]
    }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{"visibility": "on"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffe15f"}]
    }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{"color": "#efd151"}]
    }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#ffffff"}]
    }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{"color": "black"}]
    }, {
        "featureType": "transit.station.airport",
        "elementType": "geometry.fill",
        "stylers": [{"color": "#cfb2db"}]
    }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{"color": "#a2daf2"}]
    }];

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 12.999503910015576, lng: 77.61588670688414},
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    // Centers map when compass is clicked on.
    this.centerMap = function(){
        map.setCenter({lat: 12.999503910015576, lng: 77.61588670688414});
    };

    //toggles the list view
    this.toggleList = function() {
        if(self.toggle() === 'hide') {
            self.toggle('show');
        } else {
            self.toggle('hide');
        }
    };

    // Pushes default locations array into new location list array
    defaultLocations.forEach(function(placeItem){
        self.locationList.push( new Location(placeItem));
    });

    // Searches for what user typed in the input bar using the locationlist array.
    // Only displaying the exact item results that user type if available in the locationlist array.
    this.optimisedList = ko.computed( function() {
        var filter = self.filterTerm().toLowerCase();
        if (!filter) {
            self.locationList().forEach(function(placeItem){
                placeItem.visible(true);
            });
            return self.locationList();
        } else {
            return ko.utils.arrayFilter(self.locationList(), function(placeItem) {
                var string = placeItem.name.toLowerCase();
                var result = (string.search(filter) >= 0);
                placeItem.visible(result);
                return result;
            });
        }
    }, self);
}

// Error handling if map doesn't load.
function errorHandlingMap() {
    $('#map').html('We had trouble loading Google Maps. Please refresh your browser and try again.');
}
//biinding
function startApp() {
    ko.applyBindings(new ViewModel());
}