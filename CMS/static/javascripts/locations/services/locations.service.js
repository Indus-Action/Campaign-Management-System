(function () {
  'use strict';

  angular
    .module('vms2.locations.services')
    .factory('Locations', Locations);

  function Locations($http) {
    var Locations = {
      all: all,
      allLatLng: allLatLng,
      nearbyFromText: nearbyFromText,
      nearbyFromLatLng: nearbyFromLatLng,
      create: create,
      get: get,
      getLatLngFromGoogle: getLatLngFromGoogle,
      update: update,
      deleteLoc: deleteLoc,
      getPlacesAutocompleteInstance: getPlacesAutocompleteInstance,
      getPlacesServiceInstance: getPlacesServiceInstance
    };

    return Locations;

    function all() {
      return $http.get('/api/v1/locations/');
    }

    function allLatLng() {
      var locations = $http.get('/api/v1/locations/'),
          latlngs = [];

      for (var location in locations) {
        latlngs.push({"lat": location.lat, "lng": location.lng});
      }

      return latlngs;
    }

    function nearbyFromText(text) {
      return $http.get('/api/v1/locations/search_nearby_using_text/?text=' + text);
    }

    function nearbyFromLatLng(lat, lng) {
      return $http.get('/api/v1/locations/search_nearby_using_lat_lng/?lat=' + lat + '&lng=' +lng);
    }

    function create(data) {
      return $http.post('/api/v1/locations/', {
        description: data.description,
        street_number: data.street_number,
        route: data.route,
        sublocality_level_3: data.sublocality_level_3,
        sublocality_level_2: data.sublocality_level_2,
        sublocality_level_1: data.sublocality_level_1,
        locality: data.locality,
        administrative_area_level_2: data.administrative_area_level_2,
        administrative_area_level_1: data.administrative_area_level_1,
        country: data.country,
        postal_code: data.postal_code,
        lat: data.lat,
        lng: data.lng
      });
    }

    function update(location) {
      return $http.put('/api/v1/locations/' + location.id + '/', location);
    }

    function deleteLoc(id) {
      return $http.delete('/api/v1/locations/' + id + '/');
    }

    function get(id) {
      return $http.get('/api/v1/locations/' + id + '/');
    }

    function getLatLngFromGoogle(address) {
      return $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address);
    }

    function getPlacesAutocompleteInstance() {
      return new google.maps.places.AutocompleteService();
    }

    function getPlacesServiceInstance(map) {
      return new google.maps.places.PlacesService(map);
    }
  }
})();
