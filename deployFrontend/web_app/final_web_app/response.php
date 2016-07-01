<?php
$configFile = fopen("couchDBConfig.txt", "r") or die("Unable to open file!");
$address = fgets($configFile);
if (is_ajax()) {
  if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
    $action = $_POST["action"];
    switch($action) { //Switch case for value of action
	  case "story1Positive": loadStoryOnePositive(); break;
	  case "story1Negative": loadStoryOneNegative(); break;
	  case "story2Positive": loadStoryTwoPositive(); break;
	  case "story2Negative": loadStoryTwoNegative(); break;
	  case "story3Positive": loadStoryThreePositive(); break;
	  case "story3Negative": loadStoryThreeNegative(); break;
	  case "story4Positive": loadStoryFourPositive(); break;
	  case "story4Negative": loadStoryFourNegative(); break;
	  case "story2Suburb": loadScenarioTwoSuburbCount(); break;
	  case "story4Suburb": loadScenarioFourSuburbCount(); break;
	  case "family": loadFamily(); break;
	  case "income": loadIncome(); break;
      case "1": loadScenarioOne(); break;
	  case "2": loadScenarioTwo(); break;
	  case "3": loadScenarioThree(); break;
	  case "4": loadScenarioFour(); break;
    }
  }
}
//Function to check if the request is an AJAX request
function is_ajax() {
  return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

function loadStoryOnePositive(){
	global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story1Positive");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryOneNegative(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story1Negative");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryTwoPositive(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story2Positive");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryTwoNegative(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story2Negative");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryThreePositive(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story1ExtendPositive");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryThreeNegative(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story1ExtendNegative");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryFourPositive(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story1ExtendPositive");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadStoryFourNegative(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $storiesDB->group_level(TRUE);
  $storiesDB->reduce(TRUE);
  $story1view = $storiesDB->getView("hasCoordinate","story1ExtendNegative");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadScenarioOne(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);
  
  $story1view = $storiesDB->getView("hasCoordinate","hasCoordinate");
  $resultArray = json_encode((array)$story1view);
		 
  echo $resultArray;
}

function loadScenarioTwo(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $story2view = $storiesDB->getView("hasCoordinate","story2");
  $resultArray = json_encode((array)$story2view);
		 
  echo $resultArray;
}

function loadScenarioTwoSuburbCount(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  
  $storiesDB = new couchClient($couch_dsn,$stories);
  
  $storiesDB->group_level(TRUE);
  $suburbsView = $storiesDB->getView("hasCoordinate","story2SuburbCount");
  $suburbsJSON = json_encode((array)$suburbsView);
		 
  echo $suburbsJSON;
}

function loadScenarioFourSuburbCount(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  
  $storiesDB = new couchClient($couch_dsn,$stories);
  
  $storiesDB->group_level(TRUE);
  $suburbsView = $storiesDB->getView("hasCoordinate","popularSuburbCount");
  $suburbsJSON = json_encode((array)$suburbsView);
		 
  echo $suburbsJSON;
}

function loadScenarioThree(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $story2view = $storiesDB->getView("hasCoordinate","hasCoordinate");
  $resultArray = json_encode((array)$story2view);
		 
  echo $resultArray;
}

function loadScenarioFour(){
  global $address;
  $couch_dsn = "http://".$address;
  $stories = "tweets";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  $storiesDB = new couchClient($couch_dsn,$stories);

  $story4view = $storiesDB->getView("hasCoordinate","popularCount");
  $resultArray = json_encode((array)$story4view);
		 
  echo $resultArray;
}

function loadFamily(){
  global $address;
  $couch_dsn = "http://".$address;
  $family = "family_data";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  
  $familyDB = new couchClient($couch_dsn,$family);

  $familyView = $familyDB->getView("view","familyView");
  $familyJSON = json_encode((array)$familyView);
		 
  echo $familyJSON;
}

function loadIncome(){
  global $address;
  $couch_dsn = "http://".$address;
  $income = "block_income";

  require_once "lib/couch.php";
  require_once "lib/couchClient.php";
  require_once "lib/couchDocument.php";
  
  $incomeDB = new couchClient($couch_dsn,$income);

  $incomeView = $incomeDB->getView("incomeView","incomeView");
  $incomeJSON = json_encode((array)$incomeView);
		 
  echo $incomeJSON;
}


?>