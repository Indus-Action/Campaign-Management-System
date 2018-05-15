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
      update: update
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

    function create(location_data) {
      return $http.post('/api/v1/locations/', {
        street_number: data.street_number,
        route: data.route,
        sublocality_level_3: data.sublocality_level_3,
        sublocality_level_2: data.sublocality_level_2,
        sublocality_level_1: data.sublocality_level_1,
        locality: data.locality,
        administrative_area_2: data.administrative_area_2,
        administrative_area_1: data.administrative_area_1,
        country: data.country,
        pincode: data.pincode,
        lat: data.lat,
        lng: data.lng
      });
    }

    function update(location) {
      return $http.put('/api/v1/locations/' + location.id + '/', location);
    }

    function get(id) {
      return $http.get('/api/v1/locations/' + id + '/');
    }
  }
})();
