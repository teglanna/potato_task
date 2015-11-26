var app = angular.module('myApp', ['infinite-scroll']);
var url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=JSON_CALLBACK"

/* Loading data */
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

    /* Latest post at the beginning */
    var sortedItems = data.items.sort(function(a,b) {
    	return getDate(a) - getDate(b);
    });

    /* Create own array with necessary data */
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

        arr.push(obj);              
    });


	/* First ten posts added, and loading more */
    addToArray(arr, posts, 10);

    $scope.loadMore = function() {
		addToArray(arr, posts, 2);
	}
    
    /* Change content by clicking */
    $scope.showDetail = function(detail) {
    	$scope.detail = detail;

		document.getElementById('post-list').style.display = "none";
		document.getElementById('post-details').style.display = "block";
	}

	$scope.showList = function() {
		document.getElementById('post-list').style.display = "block";
		document.getElementById('post-details').style.display = "none";
	}

  })

});;/* ng-infinite-scroll - v1.0.0 - 2013-02-23 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        var lastScrollTop = 0;
        var lastInfiniteScroll = -1;
          
        handler = function() {
          var st = $(this).scrollTop();
          var downScroll = false;
          if (st > lastScrollTop){
            downScroll = true;
          } 
          lastScrollTop = st;
          if (!downScroll || new Date().getTime() - lastInfiniteScroll < 400) {
            return;
          }

          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {

            lastInfiniteScroll = new Date().getTime();

            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
]);