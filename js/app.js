var app = angular.module('myApp', ['infinite-scroll']);
var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK"

var addToArray = function(from, to, n) {
	for (var i = 0; i<n && i<from.length; i++) {
		to.push(from.pop());
	}
}

app.controller('postsCtrl', function($scope, $http) {
  $http.jsonp(url)
  .success(function(data){
  	var arr = [];
  	var posts = [];
    $scope.posts = posts;

    var getDate = function(item) {
    	return new Date(item.published);
    };

    var sortedItems = data.items.sort(function(a,b) {
    	return getDate(a) - getDate(b);
    });



	sortedItems.map(function(item) {

    	var el = document.createElement('div');
    	el.innerHTML = item.description;

        var obj = {};
        obj.published_date = moment(getDate(item)).format("Do MMM YYYY [at] HH:mm");
        obj.title = item.title;
        obj.link = item.link;
        obj.pic = item.media.m;
        obj.author = item.author;
        obj.photo_author = el.getElementsByTagName('a')[0].innerHTML;
	    obj.photo_title = el.getElementsByTagName('a')[1].getAttribute("title");
	    obj.tags = item.tags.split(' ');
	    obj.author_link = el.getElementsByTagName('a')[0].getAttribute("href");

        console.log(obj.author_link);
        arr.push(obj);
        
      
//        console.log(arr[0].published_date);
    });

    addToArray(arr, posts, 10);
    
    $scope.showDetail = function(detail) {
    	$scope.detail = detail;

		document.getElementById('post-list').style.display = "none";
		document.getElementById('post-details').style.display = "block";
	}

	$scope.showList = function() {
		document.getElementById('post-list').style.display = "block";
		document.getElementById('post-details').style.display = "none";
	}

	$scope.loadMore = function() {
		addToArray(arr, posts, 2);
	}


  })

});