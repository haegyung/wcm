wcm.controller("PostController", function($scope, $http, $stateParams) {
  
	$scope.postId = $stateParams.postId;
  $scope.cards = [];
  $scope.comments = [];
  $scope.comments_count = 0;

  var request = $http({
    method: "get",
    url: mServerAPI + "/cardDetail/" + $scope.postId,
    crossDomain : true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    cache: false
  });

  request.success(function(data) {

    $scope.postTitle = data.cards[0].title;
    $scope.postDescription = data.cards[0].description;
    $scope.postImage = data.cards[0].img_path;
    $scope.lat = data.cards[0].location_lat;
    $scope.lng = data.cards[0].location_long;
    $scope.initMap(data);
  });



  // ==================================== reverse geocording ======================================

  $scope.initMap = function(data) {
	  var map = new google.maps.Map(document.getElementById('map'), {
	    zoom: 8,
	    center: {lat: Number(data.cards[0].location_lat), lng: Number(data.cards[0].location_long)}
	  });
	  var geocoder = new google.maps.Geocoder;
	  var infowindow = new google.maps.InfoWindow;

	  $scope.geocodeLatLng(geocoder, map, infowindow);

	}

	$scope.geocodeLatLng = function(geocoder, map, infowindow) {
	  // var input = document.getElementById('latlng').value;
	  // var latlngStr = input.split(',', 2);
	  // var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};

	  var latlng = { lat: parseFloat($scope.lat), lng: parseFloat($scope.lng) };

	  geocoder.geocode({'location': latlng}, function(results, status) {
	    if (status === google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
	        map.setZoom(11);
	        var marker = new google.maps.Marker({
	          position: latlng,
	          map: map
	        });
	        
	        infowindow.setContent(results[1].formatted_address);
	        infowindow.open(map, marker);

	        $scope.address = results[1].formatted_address;
	        
	      } else {
	        window.alert('No results found');
	      }
	    } else {
	      window.alert('Geocoder failed due to: ' + status);
	    }
	  });
	}


  // ==================================== get comments ======================================

  var request2 = $http({
      method: "get",
      url: mServerAPI + "/comments",
      crossDomain : true,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
      cache: false
  });

  /* Successful HTTP post request or not */
  request2.success(function(data) {

      for (var i = 0; i <  data.comments.length; i++) {
        var object =  data.comments[i];
       	
       	if (object.post_id === $stateParams.postId) {

       		if (object.username === null || object.userimage === null) {
       			object.username = "no nickname";
       			object.userimage = "http://mud-kage.kakao.co.kr/14/dn/btqchdUZIl1/FYku2ixAIgvL1O50eDzaCk/o.jpg"
       			$scope.comments.push(object);
       			$scope.comments_count ++;
       		} else {
       			$scope.comments.push(object);
       			$scope.comments_count ++;
       		}
       	}    
      }
  });


  // ==================================== post comment ======================================

	$scope.addComment =function() {
  
    var comment = document.getElementById("comment").value

    if (window.localStorage['user'] != null) {
	    var user = JSON.parse(window.localStorage['user'] || '{}');
	    $scope.username = user.properties.nickname;
	    $scope.userimage = user.properties.thumbnail_image;
	  }

	  var post_id = parseInt($stateParams.postId);
    var user_app_id = parseInt(user.id);
    var content = comment;
    var username = $scope.username;
    var userimage = $scope.userimage;

    var formData = {
		      						post_id: post_id,
		                  user_app_id: user_app_id,
		                  content: content,
		                  username: username,
		                  userimage: userimage
		          			};

    var postData = 'commentData='+JSON.stringify(formData);


    $scope.comments.push(formData);
 		console.log($scope.comments);


    var request = $http({
        method: "post",
        url: mServerAPI + "/comments",
        crossDomain : true,
        data: postData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
        cache: false
    });

    /* Successful HTTP post request or not */
    request.success(function(data) {

    	document.getElementById("comment").value = "";
    	$scope.comments_count ++;

    });
  }




});





















