jQuery(document).ready(function($){
	/**
	** Searching Station Algorithm
	** Find A Journy Button Click Event
	**/
	$(document).on( 'click', '#find-journy-btn', function(event){
		if( $("#pickup_station").val().trim() == ''){
			alert("Please enter a valid station!");
			return false;
		}
		if( $("#search-result-area").find('.searching-spinner').length != 0)
			return false;
		$("#search-result").removeClass('hidden');
		$("#search-result-area").html('<img src="images/loading.gif" alt="Searching..." style="max-width:140px;" class="m-center searching-spinner">');
		$('html, body').animate({
			scrollTop: $("#search-result-area").offset().top
		}, 1000, 'linear');
		$.post( 'service.php', { sl_service_action: 'get_station', station_name: $("#pickup_station").val()}, function(data, status){
			var incomingJournies = $.parseJSON(data);
			var output = '<div class="row">';
			var currentlyRunning = '<i title="Journey Is Not Running" class="fa fa-circle red-color" aria-hidden="true"></i>';
			$.each(incomingJournies, function(index, journey){
				if(journey.runningCurrently == true)
					currentlyRunning = '<i title="Journey Is Running" class="fa fa-circle green-color" aria-hidden="true"></i>';
				output += '<div class="col-lg-4 col-sm-6"><div class="box-container relative gray-background gray-borders margin-bottom margin-top"><div title="Train Number" class="train-number-box hidden-xs break-background text-center white-color">'+journey.trainNumber+'</div><table class="full-width small-font"><tbody><tr class="visible-xs"><tr class="train-detail"><td  class="break-color label-icon"> <i class="fa fa-ticket" aria-hidden="true"></i> </td><td class="break-color">  <strong>Train Number: </strong> </td><td class="padding-left">'+journey.trainNumber+'</td></tr><tr class="train-detail"><td  class="break-color label-icon"> <i class="fa fa-calendar" aria-hidden="true"></i> </td><td class="break-color">  <strong>Departure Date: </strong> </td><td class="padding-left">'+journey.departureDate+'</td></tr><tr class="train-detail"><td  class="break-color label-icon"> <i class="fa fa-train" aria-hidden="true"></i> </td><td class="break-color">  <strong>Train Type:</strong> </td><td class="padding-left">'+journey.trainType+'</td></tr><tr><td  class="break-color label-icon">  <i class="fa fa-rocket" aria-hidden="true"></i> </td><td class="break-color"> <strong>Currently Running: </strong> </td><td class="padding-left">'+currentlyRunning+'</td></tr></tbody></table><div data-train="'+journey.trainNumber+'" data-departure="'+journey.departureDate+'" class="read-more darker-background white-color" title="Journey Details"><i class="fa fa-plus" aria-hidden="true"></i></div></div><!-- end of box container --></div><!-- end of col -->';
			});
			output += '</div> <!-- end of row -->';
			$('.searching-spinner').remove();
			$("#search-result-area").append( output );
			$('html, body').animate({
				scrollTop: $("#search-result-area").offset().top
			}, 1000, 'linear');
		});
	});/*end find journey button click event*/
	

	/**
	** Finding Journey Sections
	** Plus Icon Click Event
	**/
	$(document).on( 'click', '#search-result-area .read-more', function(event){
		if( $("#sl_popup-container .popup-content .content").find('.searching-spinner').length != 0)
			return false;
		var departureDate = $(this).attr('data-departure');
		var trainNumber = $(this).attr('data-train');
		$("#sl_popup-container").removeClass('hidden');
		$("#sl_popup-container .popup-content .content").html('<img src="images/loading.gif" alt="Searching..." style="max-width:50px;" class="m-center searching-spinner">');
		$.post('service.php', {sl_service_action: 'query_composition', train_number: trainNumber, departure_date: departureDate }, function(data, status){
			var section = $.parseJSON(data);
			var output = '<table class="full-width"><tbody>';
			var wagons = '';
			console.log(section)
			$.each( section.journeySections[0].wagons, function(wagonIndex, wagon){
				wagons += wagon.wagonType+', ';
			});
			wagons = wagons.replace(/,\s*$/, "");
			output +='<tr><td><strong>Train Number:</strong></td><td class="padding-left">'+section.trainNumber+'</td></tr><tr><td><strong>Departure Date:</strong></td><td class="padding-left">'+section.departureDate+'</td></tr><tr><td><strong>Departure Station</strong></td><td class="padding-left">'+section.journeySections[0].beginTimeTableRow.stationShortCode+'</td></tr><tr><td><strong>Destination Station</strong></td><td class="padding-left">'+section.journeySections[0].endTimeTableRow.stationShortCode+'</td></tr><tr><td><strong>Locomotive Type</strong></td><td class="padding-left">'+section.journeySections[0].locomotives[0].locomotiveType+'</td></tr><tr><td><strong>Power Type</strong></td><td class="padding-left">'+section.journeySections[0].locomotives[0].powerType+'</td></tr><tr><td><strong>Wagons Type</strong></td><td class="padding-left">'+wagons+'</td></tr><tr><td><strong>Total Length:</strong></td><td class="padding-left">'+section.journeySections[0].totalLength+' km</td></tr><tr><td><strong>Maximum Speed</strong></td><td class="padding-left">'+section.journeySections[0].maximumSpeed+' km/h</td></tr>';
			output += '</tbody></table>';
			$("#sl_popup-container .popup-content .content").append( output );
			$("#sl_popup-container .popup-content .content .searching-spinner").remove();
		});

	});/*end finding journey sections*/

	/**
	** Closing Popup 
	** Popup Close Button Click Event
	**/
	$(document).on( 'click', '#sl_popup-container .popup-close', function(event){
		$("#sl_popup-container").addClass('hidden');
	});/*end of closing popup click event*/
});