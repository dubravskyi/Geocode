let app = angular.module("mapApp", []);

app.service('Map', function($q) {
    
    this.init = function() {
        let options = {
            center: new google.maps.LatLng(49.839683,24.029717),
            zoom: 13,
        }
        this.map = new google.maps.Map(
            document.getElementById("map"), options
        );
    }
    
    this.addMarker = function(res) {
        if(this.marker) this.marker.setMap(null);
        this.marker = new google.maps.Marker({
            map: this.map,
            position: res.geometry.location,
            animation: google.maps.Animation.DROP
        });
        this.map.setCenter(res.geometry.location);
    }
    
});

app.controller("mapCtrl",function($scope,$http,Map){
     $scope.sendRequest = function () {

        let answ = $http.get("https://maps.googleapis.com/maps/api/geocode/json",{
            params:{
                address:$scope.address,
                key:"AIzaSyBFlV32wT8uyCYvh_dtkxzBvPziyaqT460",
                region:"ua"
            }
        })

        answ.then(fulfiled,rejected)

        function fulfiled (response) {
            if(response.data.status == "ZERO_RESULTS"){
                $scope.searchError = true;
                $scope.errorText = "Такої адреси не знайдено!";
            }else if(response.data.status == "OK"){
                $scope.searchError = false;
                $scope.errorText = "";
                response = response.data;
                $scope.location = response.results[0].geometry.location;
                $scope.formatedAddress = response.results[0].formatted_address;
                Map.addMarker(response.results[0]);
            }
        }
        function rejected(error){
            if(error.data){
                $scope.searchError = true;
                $scope.errorText = error.data.error_message; 
            }else{
                $scope.searchError = true;
                $scope.errorText = "Перевірте з'єднання з інтернетом"; 
            }
            
        }
    }
    Map.init();

});
         