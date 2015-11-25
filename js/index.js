var url = "https://api.flickr.com/services/feeds/photos_public.gne?tags=potato&tagmode=all&format=json&jsoncallback=?";

$(document).ready(function() {
	var getFeedContents = function() {

		return $.getJSON(url).then(function(data) {
			var arr = [];
			data.items.map(function(item) {
				
				var el = $("<div>");
				el.html(item.description);

				var published = moment(new Date(item.published)).format("Do MMM YYYY [at] HH:mm");
				var obj = {};
				obj.title = item.title;
				obj.link = item.link;
				obj.pic = item.media.m;
				obj.author = item.author;
				obj.published_date = published;
				obj.photo_author = $('a', el).eq(0).text();
				obj.photo_title = $('a', el).eq(1).attr("title");
				obj.author_link = $('a', el).eq(0).attr("href");
				arr.push(obj);
			});
	//		console.log(arr[0].photo_title);
			return arr;		
		});
	}


	var addToUl = function(arr) {
		arr.map(function(item) {
			var row = $("<li>");
			
			var image = $("<img class='thumb' onclick='showDetail()' />").attr("src", item.pic);
			var crop = $("<div class='crop'>");
			sized_img = crop.append(image);
	//		$(image).wrap('<a href="#meta_content"></a>');
			var details = $("<div class='meta_details'>");
			var meta1 = $("<div class='meta_block1'>");
			var meta2 = $("<div class='meta_block2'>");
			
			var title = $("<div class='title'><h2></h2></div>");
			var post_content = $("<div class='meta_content'><h2>"+item.title+"</h2><div class='back' onclick='goBack()'>Back</div></br><p>" +item.photo_author+ " | " +item.published_date+ "</p></div>");
			var image_detail = $("<div class='img_detail'>");
			console.log(sized_img);
			post_content.append(image_detail);

			showDetail = function() {
				$("#main ul").html($(post_content));
			}
			details.append(meta1, meta2);
			meta1.append("<p class='title'>" +item.title+ "</br></p><p class='date'><a href='"+item.author_link+"' target='_blank'>" + item.author + "</a>&nbsp&nbsp&nbsp" +item.published_date + "&nbsp&nbsp&nbsp<a href='" +item.link+ "' target='_blank'>View on Flickr</a></p>");
			meta2.append("<p class='title'>" +item.photo_title+ "</p><p class='date'>" + item.published_date+"</p><p><a href='"+item.author_link+"' target='_blank'>" +item.photo_author+ "</a>&nbsp&nbsp&nbsp<a href='" +item.link+ "' target='_blank'>View on Flickr</a></p>");

		//	meta.append(title, details);
			$("#main ul").append(row);
			$(row).append(sized_img, details);
			
		});
	//	$(".thumb").wrap('<a href="#"></a>');	
	}

getFeedContents().then(addToUl);

});







/*
$(document).ready(function(){

	$.getJSON(url, function(data){
			//en irtam
			$.each(data.items, function(i,item){
//    			$(".details").attr("src", item.media.m).appendTo("#images").wrap("<a href='" + item.link + "'></a>");
//				$(".details").append(item.author);
				
				var row = $("<li></li>");
				var crop = $("<div class='crop'></div>");
//				var link = $("<a href='post_content.html'>" +image+ "</a>");
				var image = $("<img class='thumb'/>").attr("src", item.media.m);
				var meta = $("<div class='meta_block'></div>");
				var details = $("<div class='meta_details'></div>");
				var title = $("<div class='title'><h2></h2></div>");
								

				if( $(window).width() < 800 ){
						title.html("<p>" +item.title+ "</p>");
						details.html("<p>" +item.date_taken+"</p>" + "<p>" +item.author+ "<a>View on Flickr</a></p>");
					}
				if( $(window).width() >= 800 ){
					title.html("<p>" +item.tags+ "</p>");
					details.html("<p>" + item.author + item.date_taken + "<a>View on Flickr</a></p>");
				}

				$(window).resize(function() {
					if( $(window).width() < 800 ){
						title.html("<p>" +item.title+ "</p>");
						details.html("<p>" +item.date_taken+"</p>" + "<p>" +item.author+ "<a>View on Flickr</a></p>");
					}
					if( $(window).width() >= 800 ){
						title.html("<p>" +item.tags+ "</p>");
						details.html("<p>" + item.author + item.date_taken + "<a>View on Flickr</a></p>");
					}
				});



				meta.append(title, details);
				crop.append(image);
				$("#main ul").append(row);
				row.append(crop, meta);

				

  			});

			$(".thumb").wrap('<a href="#"></a>');

//			$.each(data.items, function(i,item){
//				var content = $("<div id='meta_content'><h2>"+item.title+ "</h2><p>" +item.author+ " | " +item.date_taken+ "</p></div>");
//			});

			$(".crop a").on('click', function() {
				$("#main ul").html("<div id='meta_content'><h2>"+item.title+ "</h2><p>" +item.author+ " | " +item.date_taken+ "</p></div>");
			});
			
			
	});
});

*/