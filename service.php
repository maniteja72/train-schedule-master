<?php
error_reporting(0);
// https://groups.google.com/forum/#!forum/rata_digitraffic_fi
function slCurlGetContents( $URL = '' ){
	if( empty($URL) )
		return "ERROR: Invalid URL provided";
	$c = curl_init();
	curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($c, CURLOPT_URL, $URL);
	curl_setopt($c, CURLOPT_FOLLOWLOCATION, true);   
	curl_setopt($c,CURLOPT_SSL_VERIFYPEER, false);
	$contents = curl_exec($c);
	$err  = curl_getinfo($c,CURLINFO_HTTP_CODE);
	curl_close($c);
	if ($contents) return $contents;
	else return false;
}
if( isset($_POST['sl_service_action']) && !empty($_POST['sl_service_action'] ) ){
	extract($_POST);
	if( $sl_service_action == 'get_station'){
		$url = 'https://rata.digitraffic.fi/api/v1/live-trains?station='. $station_name;
		$return = slCurlGetContents( $url );
		header("Status: 200");
		echo $return;
		die();
	}
	if( $_POST['sl_service_action'] == 'query_composition'){
		$url = 'https://rata.digitraffic.fi/api/v1/compositions/'.$train_number.'?departure_date='.$departure_date;
		$return = slCurlGetContents( $url );
		header("Status: 200");
		echo $return;
		die();
	}
	header("Status: 503");
	echo json_encode('Invalid Request');
}
