<?php
header('Content-Type: text/plain; charset=utf-8');
header('Access-Control-Allow-Headers:Content-Type');
header('Access-Control-Allow-Methods:GET, POST, OPTIONS');
header('Access-Control-Allow-Origin:*');

//GET Legislators info;
//$header = "http://104.198.0.197:8080/";
$header = "http://congress.api.sunlightfoundation.com/";
if (isset($_GET['database']) && $_GET['database'] == "legislators" && isset($_GET['apikey']) && isset($_GET['per_page'])) {
   $detailsURL = $header.$_GET['database']."?&apikey=".$_GET['apikey']."&per_page=".$_GET['per_page'];
   $detailsjson = file_get_contents($detailsURL);
   $detailsobj = json_decode($detailsjson,true);
   echo $detailsjson;   
}


//GET Bills info;
if (isset($_GET['database']) && $_GET['database'] == "bills" && isset($_GET['apikey']) && isset($_GET['per_page']) && isset($_GET['sponsor_id'])) {
   $detailsURL = $header.$_GET['database']."?&apikey=".$_GET['apikey']."&order=introduced_on&per_page=".$_GET['per_page']."&sponsor_id=".$_GET['sponsor_id'];
   $detailsjson = file_get_contents($detailsURL);
   $detailsobj = json_decode($detailsjson,true);
   echo $detailsjson;
} else if (isset($_GET['database']) && $_GET['database'] == "bills" && isset($_GET['apikey']) && isset($_GET['per_page']) && isset($_GET['type']) && $_GET['type'] == "active") {
   $detailsURL = $header.$_GET['database']."?&apikey=".$_GET['apikey']."&history.active=true&order=introduced_on&per_page=".$_GET['per_page'];
   $detailsjson = file_get_contents($detailsURL);
   $detailsobj = json_decode($detailsjson,true);
   echo $detailsjson;
} else if (isset($_GET['database']) && $_GET['database'] == "bills" && isset($_GET['apikey']) && isset($_GET['per_page']) && isset($_GET['type']) && $_GET['type'] == "new") {
   $detailsURL = $header.$_GET['database']."?&apikey=".$_GET['apikey']."&history.active=false&order=introduced_on&per_page=".$_GET['per_page'];
   $detailsjson = file_get_contents($detailsURL);
   $detailsobj = json_decode($detailsjson,true);
   echo $detailsjson;
}


//GET Committees info;
if (isset($_GET['database']) && $_GET['database'] == "committees" && isset($_GET['apikey']) && isset($_GET['per_page']) && isset($_GET['member_ids'])) {
   $detailsURL = $header.$_GET['database']."?&apikey=".$_GET['apikey']."&per_page=".$_GET['per_page']."&member_ids=".$_GET['member_ids'];
   $detailsjson = file_get_contents($detailsURL);
   $detailsobj = json_decode($detailsjson,true);
   echo $detailsjson;
} else if (isset($_GET['database']) && $_GET['database'] == "committees" && isset($_GET['apikey']) && isset($_GET['per_page'])) {
   $detailsURL = $header.$_GET['database']."?&apikey=".$_GET['apikey']."&per_page=".$_GET['per_page'];
   $detailsjson = file_get_contents($detailsURL);
   $detailsobj = json_decode($detailsjson,true);
   echo $detailsjson;
}
?>