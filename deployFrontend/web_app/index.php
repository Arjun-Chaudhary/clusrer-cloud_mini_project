<!DOCTYPE html>
<html>
<head>
     <title>Team - CCC2016-1</title>
	 <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.css" />
	 <script src="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.js"></script>
	 <script src="http://code.jquery.com/jquery-latest.min.js" type="text/javascript"></script>
	 <link rel="stylesheet" href="css/style.css" />
	 <script src="http://d3js.org/d3.v2.js"></script>
	 <script src="loadingScenarios.js" type="text/javascript"></script>
</head>
<body>
  <div id="fade"></div>
     <div id="modal">
            <img id="loader" width="130px" height="130px" src="loading.gif" />
			<div id="current_progress"></div>
     </div>
  <div id="header">
     <h2>Team CCC2016-1</h2>
  </div>
 <div id="container">
 <table border="0">
    <tr>
	 <td valign="top" width="220px">
     <div id="side_menu">
       <table class="side_options">	
         <tr>
	       <th>Scenarios</th>
         </tr>
         <tr>
	       <th valign="middle"><select name="" onchange="loadScenario(this.value)">
		       <option selected value="" >Select</option>
		       <option value="1">Scenario 1</option>
			   <option value="2">Scenario 2</option>
			   <option value="3">Scenario 3</option>
			   <option value="4">Scenario 4</option>
			</select> 
		   </th>
         </tr>	
        <tr>
          <td><a class="js-open-modal" href="#" data-modal-id="popup"><input type="button" class="button" value="See The Team"></a></td>
        </tr>		
	   </table>
     </div>
	 <div id="side_summary"><p>Select a Scenario</p></div>
	 </td>
	 <td valign="top">
     <div id="side_info"><p>Select a Scenario</p></div>
     <div id="mapid"></div>
	 <div id="chart"></div>
	 </td>
	</tr>
  </table> 
  </div>
	 <div id="popup" class="modal-box">  
       <header>
          <a href="#" class="js-modal-close close">X</a>
          <h3>Meet The Team</h3>
       </header>
       <div class="modal-body">
          <p><img src="teamphoto.jpg" width="800px" height="400px"></p>
		  <p>
		      Umer Altaf Muhammad-778566<br/>
              Lupiya Mujala-610273<br/>
              Tingying Tsai-723957<br/>
              Arjun Chaundary-727553<br/>
              Harshit Kapoor-666810<br/>
			 </p>
       </div>
       <footer>
          <a href="#" class="js-modal-close">Close</a>
       </footer>
     </div>
	 <script type="text/javascript">
	    var story1tweets = null;
        var story2tweets = null;
        var story3tweets = null
		var story4tweets = null;
        var story1positiveTweets = null;
        var story2positiveTweets = null;
        var story3positiveTweets = null;
		var story4positiveTweets = null;
        var story1negativeTweets = null;
        var story2negativeTweets = null;
        var story3negativeTweets = null;
		var story4negativeTweets = null;
		var twitterSuburbSpread = null;
	    var familyMapArray = null;
		var incomeMapArray = null;
		var tweetsMarkers = new Array();
		var suburbTweets = new Array();
		var mapPolarityMarkers = new Array();
		var mapSuburbs = new Array();
		var twitterSuburbSpreadArray = new Array();
		var totalTopSc2 = 0;
		var currentScenario = 0;
		var totalMoreChild = 0;
		var totalNoChild = 0;
		var totalPositive = 0;
		var totalNegative = 0;
		var totalPositiveSc1 = 0;
		var totalNegativeSc1 = 0;
		var totalOtherSub = 0;
		var totalHigh = 0;
		var totalMed = 0;
		var totalLowEarn = 0;
		var totalTweets = 0;
		var totalBlocksPos = 0;
		var totalBlocksNeg = 0;
		var totalHappyRich = 0;
		var totalHappyMed = 0;
		var totalSadMed = 0;
		var totalSadRich = 0;
		var totalHappyOther = 0;
		var totalSadOther = 0;
		var totalSuburbTweets = 0;
		var happiestSuburb = "";
		var unhappiestSuburb = "";
		var scenario1Narrative = "<h3>Scenario 1</h3>"+
		                          "<p>Our theory is that smaller families in Melbourne are happier than bigger families. This is largely in part that most of"+
								  "Melbourne's infrastructure is made up of apartments and very little yard space if any. Families with larger spaces can have"+ 
								  "more freedom from family members and give each other space. Therefore, the smaller the family in Melbourne, the more likely they"+
								  "are to be happy.</p>";
		var scenario2Narrative = "<h3>Scenario 2</h3>"+
		                          "<p>We believe that the people that come from poor suburbs drink more than those rich suburbs. This is because people in poor"+
								  "circumstances have a desire to drink more to deal with or get over their depressing and less ideal financial situations. People"+
								  "in rich suburbs drink more out of leisure and for fun than anything else.</p>";
		var scenario3Narrative = "<h3>Scenario 3</h3>"+
		                          "<p>People of low-income group are happier than medium and high-income group.</p>";
		var scenario4Narrative = "<h3>Scenario 4</h3>"+
		                         "<p>Who is the most popular user and what's the tweet hotzone?</p>";
		//Define custom icons
		var tickIcon = L.icon({
           iconUrl: 'tick.png',
           iconSize: [19, 19],
           iconAnchor: [0, 0],
           popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
		var crossIcon = L.icon({
           iconUrl: 'cross.png',
           iconSize: [19, 19],
           iconAnchor: [0, 0],
           popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
	    var mymap = L.map('mapid').setView([-37.82937, 144.9433], 12);
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          maxZoom: 16,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibHVwaXlhbXVqYWxhIiwiYSI6ImNpbmIwM2RncTBqYWh2Z2t2ZjJ6aW9pcDIifQ.ENiXmfUqBt-rE_-z80RB8w'
        }).addTo(mymap);
	
	    //var custom = L.marker([-37.82937, 144.9433], {icon: crossIcon}).addTo(mymap);
		
		function loadScenario(num){
            
			currentScenario = num;
			removePreviousData();
			if(num>0){
			   openModal();
			   loadPositiveData(num);
			}
			if(num==1){
				document.getElementById("side_info").innerHTML = scenario1Narrative;							
			}else if(num==2){
				document.getElementById("side_info").innerHTML = scenario2Narrative;
			}else if(num==3){
				document.getElementById("side_info").innerHTML = scenario3Narrative;
			}else if(num==4){
				document.getElementById("side_info").innerHTML = scenario4Narrative;
			}
			//closeModal();
		}
	
	//Loads tweets onto the map
	function loadTweets(scenario){
		$(document).ready(function(){
			var obj = scenario;
		    for (var i = 0; i < obj.rows.length; i++) {
				var document = obj.rows[i];
				var tweet = document.key;
				
				var lat = tweet.coordinates.coordinates[0];
                var lon = tweet.coordinates.coordinates[1];
				var colorTweet = 'blue';
				if(tweet.polarity_final_score==-1){
					colorTweet = 'red';
				}else if(tweet.polarity_final_score==1){
					colorTweet = 'green';
				}
				
				if(currentScenario==4){
				  var tweet = L.circle([lon, lat], 20, {
                    color: colorTweet,
                    fillColor: colorTweet,
                    fillOpacity: 0.9
                  }).addTo(mymap).bindPopup("Username: "+tweet.user.screen_name+"<br/>Tweet: "+tweet.text);
				  tweetsMarkers.push(tweet);
				}else{
				  var tweet = L.circle([lon, lat], 20, {
                    color: colorTweet,
                    fillColor: colorTweet,
                    fillOpacity: 0.9
                  }).addTo(mymap).bindPopup("Tweet: "+tweet.text+"<br/>Suburb: "+tweet.suburb_code);
				  tweetsMarkers.push(tweet);
				}
             }
		});
	}
	//Loads family suburb data into the map
	//This loads the family data into the suburbs
	function loadFamilyData(){
		   // alert("Started loading family data");
		    var obj = familyMapArray;
			for (var i = 0; i < obj.rows.length; i++) {
				var document = obj.rows[i];
				var tweet = document.key;
				var geoLayer = L.geoJson(tweet, {
                  onEachFeature: onEachFeature
                }).addTo(mymap);
			}
			closeModal();
	}
	//This loads the income data into the suburbs
		function loadIncomeData(){
			//alert("Started loading income data");
			var obj = incomeMapArray;
			for (var i = 0; i < obj.rows.length; i++) {
				var document = obj.rows[i];
				var tweet = document.key;
				var geoLayer = L.geoJson(tweet, {
                  onEachFeature:onEachIncomeFeature
                }).addTo(mymap);
			}
			closeModal();
		}
	//Clears previous map data
	function removePreviousData(){
			//Clear twitter markers
			for(i = 0; i < tweetsMarkers.length; i++){
		        mymap.removeLayer(tweetsMarkers[i]);
			}
			tweetsMarkers = [];
			//Clear suburb information
			for(i = 0; i < mapSuburbs.length; i++){
		        mymap.removeLayer(mapSuburbs[i]);
			}
			mapSuburbs = [];
			//Clear the polarity marker information
			for(i = 0; i < suburbTweets.length; i++){
		        mymap.removeLayer(suburbTweets[i]);
			}
			suburbTweets = [];
			//Clear the suburb tweets
			for(i = 0; i < mapPolarityMarkers.length; i++){
		        mymap.removeLayer(mapPolarityMarkers[i]);
			}
			mapPolarityMarkers = [];
			//Remove the chart
			document.getElementById("chart").innerHTML = "";
			totalMoreChild = 0;
		    totalNoChild = 0;
			totalPositive = 0;
		    totalNegative = 0;
			totalPositiveSc1 = 0;
		    totalNegativeSc1 = 0;
			totalHigh = 0;
		    totalMed = 0;
		    totalLowEarn = 0;
			totalTweets = 0;
			happiestSuburb = "";
		    unhappiestSuburb = "";
			totalBlocksPos = 0;
		    totalBlocksNeg = 0;
			totalHappyRich = 0;
		    totalSadRich = 0;
		    totalHappyOther = 0;
		    totalSadOther = 0;
			totalHappyMed = 0;
		    totalSadMed = 0;
			totalOtherSub = 0;
			totalSuburbTweets = 0;
			totalTopSc2 = 0;
		}
		
	//This loads each individual family suburb data and binds data to the pop up 
		function onEachFeature(feature, layer) {
			
		   if(currentScenario==1){
			 //Gets the positive and negative tweet totals
			 
			 var positiveTweets = story1positiveTweets.rows.filter(function( tweet ) {
                 return tweet.key == feature.properties.feature_name;
             });
			 
             if(positiveTweets.length == 0 || positiveTweets==null)
				 positiveTweets = [{"key": feature.properties.feature_name, "value": 0}];
			 
			 var negativeTweets = story1negativeTweets.rows.filter(function( tweet ) {
                 return tweet.key == feature.properties.feature_name;
             });
             if(negativeTweets.length == 0 || negativeTweets==null)
				 negativeTweets = [{"key": feature.properties.feature_name, "value": 0}];
			 
             suburbTweets.push({ "suburb": feature.properties.feature_name, "happy": positiveTweets[0].value, "sad": negativeTweets[0].value });
			 
			 //:TICK for :”if((happy tweets > sad tweets) && (family without kids > family with kids))”
			 
             //CROSS for : ”if((happy tweets > sad tweets) && (family without kids > family with kids))”
			 //Return center of the suburb
			 // Get bounds of polygon
             var bounds = layer.getBounds();
             // Get center of bounds
             var center = bounds.getCenter();
			 var polarityMarker = null;

			 totalPositive = totalPositive + positiveTweets[0].value;
		     totalNegative = totalNegative + negativeTweets[0].value;
			
			 if(positiveTweets[0].value>negativeTweets[0].value && feature.properties.MEASURE_1>feature.properties.MEASURE_2){
			     polarityMarker = L.marker([0,0], {icon: tickIcon}).addTo(mymap);
				 polarityMarker.setLatLng(center);
				 mapPolarityMarkers.push(polarityMarker);
				 totalMoreChild++;
				 totalPositiveSc1 = totalPositiveSc1 + positiveTweets[0].value;
			 }else if(positiveTweets[0].value<negativeTweets[0].value && feature.properties.MEASURE_1>feature.properties.MEASURE_2){
				 polarityMarker = L.marker([0,0], {icon: crossIcon}).addTo(mymap);
				 polarityMarker.setLatLng(center);
				 mapPolarityMarkers.push(polarityMarker);
				 totalNoChild++;
				 totalNegativeSc1 = totalNegativeSc1 + negativeTweets[0].value;
			 }else{
				 layer.setStyle({
				  fillColor: 'red',
				  opacity: 0.9
			     });
				 totalOtherSub++;
			 }
			 var popUpInfo = "Suburb Name: "+feature.properties.feature_name+"<br/> Year: "+feature.properties.TIME+"<br/> One Parent Family: "+
			                 feature.properties.MEASURE_3+"<br/> Couple family with Children: "+feature.properties.MEASURE_2+"<br/>Couple family with no children: "+
							 feature.properties.MEASURE_1+"<br/>Couple family Total: "+feature.properties.MEASURE_CF+"<br/>Other family: "+feature.properties.MEASURE_9+
							 "<br/>Positive Tweets: "+positiveTweets[0].value+"<br/>Negative Tweets: "+negativeTweets[0].value;
			 
             layer.bindPopup(popUpInfo);
			 mapSuburbs.push(layer);
			 
		     }else{
				/** var positiveTweets = story4positiveTweets.rows.filter(function( tweet ) {
                  return tweet.key == feature.properties.feature_code;
                });
                if(positiveTweets.length == 0 || positiveTweets==null)
				   positiveTweets = [{"key": feature.properties.feature_name, "value": 0}];
			 
			    var negativeTweets = story4negativeTweets.rows.filter(function( tweet ) {
                   return tweet.key == feature.properties.feature_code;
                });
                if(negativeTweets.length == 0 || negativeTweets==null)
				   negativeTweets = [{"key": feature.properties.feature_name, "value": 0}];
			 
                 suburbTweets.push({ "suburb": feature.properties.feature_name, "happy": positiveTweets[0].value, "sad": negativeTweets[0].value });**/
				 
				 var total = 0;
			     var notFound = false;
	             for (var i = 0; i < twitterSuburbSpreadArray.length && !notFound; i++) {
		            if(twitterSuburbSpreadArray[i].suburb==feature.properties.feature_name){
					   notFound = true;
					   total = twitterSuburbSpreadArray[i].total;
				    }
	             }
				 totalSuburbTweets++;
				 //totalPositive = totalPositive + positiveTweets[0].value;
		         //totalNegative = totalNegative + negativeTweets[0].value;
				 var familyTotal = feature.properties.MEASURE_3 + feature.properties.MEASURE_2 + feature.properties.MEASURE_1 + feature.properties.MEASURE_CF + feature.properties.MEASURE_9;
				 var popUpInfo = "Suburb Name: "+feature.properties.feature_name+"<br/>Total Tweets: "+total+"<br/>Total Families: "+familyTotal;
				  layer.bindPopup(popUpInfo);
				 mapSuburbs.push(layer);
			 }
          }
		  
		  //This binds popup data to each individual suburb for income
		  function onEachIncomeFeature(feature, layer){
			  
			  var earnersSummary = new Array();
			  var totalEarnersMale = feature.properties.FI_1_199_Tot + feature.properties.FI_200_299_Tot + feature.properties.FI_300_399_Tot + feature.properties.FI_400_599_Tot + feature.properties.FI_600_799_Tot +
			                         feature.properties.FI_800_999_Tot + feature.properties.FI_1000_1249_Tot + feature.properties.FI_1250_1499_Tot +
									 feature.properties.FI_1500_1999_Tot + feature.properties.FI_2000_2499_Tot + feature.properties.FI_2500_2999_Tot + feature.properties.FI_3000_3499_Tot + 
									 feature.properties.FI_3500_3999_Tot + feature.properties.FI_4000_more_Tot;
			  var suburbTotal = totalEarnersMale;				   
			  //Store data in an array and determine the average of the suburb
			  var scale1 = feature.properties.FI_1_199_Tot;
			  var scale2 = feature.properties.FI_1250_1499_Tot + feature.properties.FI_1500_1999_Tot + feature.properties.FI_2000_2499_Tot + feature.properties.FI_200_299_Tot + feature.properties.FI_300_399_Tot + feature.properties.FI_400_599_Tot +
			               feature.properties.FI_600_799_Tot + feature.properties.FI_800_999_Tot + feature.properties.FI_1000_1249_Tot;
			  var scale3 = feature.properties.FI_2500_2999_Tot + feature.properties.FI_3000_3499_Tot + feature.properties.FI_4000_more_Tot;

			  earnersSummary.push({ "scale": "low", "value": scale1});
			  earnersSummary.push({ "scale": "medium", "value": scale2});
			  earnersSummary.push({ "scale": "high", "value": scale3});

			  earnersSummary.sort(function(a, b) {
                return b.value - a.value;
              });
			  
			  var total = 0;
			  var notFound = false;
	          for (var i = 0; i < twitterSuburbSpreadArray.length && !notFound; i++) {
		         if(twitterSuburbSpreadArray[i].suburb==feature.properties.feature_name){
					 notFound = true;
					 total = twitterSuburbSpreadArray[i].total;
				 }
	          }
			  
			  var fillColor = null;
			  if(earnersSummary[0]=="low"){
				  fillColor = "#990000";
				  totalLowEarn = totalLowEarn + total;
			  }else if(earnersSummary[0].scale=="medium"){
				  fillColor = "#80ff80";
				  totalMed = totalMed + total;
			  }else if(earnersSummary[0].scale=="high"){
				  fillColor = "#e6b800";
				  totalHigh = totalHigh + total;
			  }
			  totalTweets = totalTweets + total;
			  layer.setStyle({
				  fillColor: fillColor,
				  opacity: 0.9,
				  radius: 1
			  });
			  
			  var bounds = layer.getBounds();
                  // Get center of bounds
              var center = bounds.getCenter();
			  
			  if(currentScenario==3){
				  
			      var polarityMarker = null;
				  var positiveTweets = story3positiveTweets.rows.filter(function( tweet ) {
                     return tweet.key == feature.properties.feature_name;
                  });
			 
			      var negativeTweets = story3negativeTweets.rows.filter(function( tweet ) {
                     return tweet.key == feature.properties.feature_name;
                  });
				  if(positiveTweets>negativeTweets){
					  polarityMarker = L.marker([0,0], {icon: tickIcon}).addTo(mymap);
				      polarityMarker.setLatLng(center);
				      mapPolarityMarkers.push(polarityMarker);
					  totalBlocksPos++;
					  if(earnersSummary[0].scale=="high"){
					     totalHappyRich++;
				      }else if(earnersSummary[0].scale=="medium"){
						  totalHappyMed++;
					  }else{
						 totalHappyOther++;
					  }
				  }else{
					  polarityMarker = L.marker([0,0], {icon: crossIcon}).addTo(mymap);
				      polarityMarker.setLatLng(center);
				      mapPolarityMarkers.push(polarityMarker);
					  totalBlocksNeg++;
					  if(earnersSummary[0].scale=="high"){
					     totalSadRich++;
				      }else if(earnersSummary[0].scale=="medium"){
						  totalSadMed++;
					  }else{
						  totalSadOther++;
					  }
				  }
				  total = positiveTweets + negativeTweets;
			  }
			  
			  if(currentScenario==2){
                  var found = false;
				  if(earnersSummary[0].scale=="high" && totalTopSc2<=10){
				     for (var i = 0; i < suburbTweets.length && !found; i++) {
					  if(feature.properties.feature_name==suburbTweets[i].suburb)
						  found = true;
			        }
				    if(found){
                       var polarityMarker = L.marker([0,0], {icon: tickIcon}).addTo(mymap);
				       polarityMarker.setLatLng(center);
				       mapPolarityMarkers.push(polarityMarker);
					   totalTopSc2++;
				    }
				  }
			  }
			  
			  var percentage = (earnersSummary[1].value/totalEarnersMale)*100;
			  var popUpInfo = "Suburb Name: "+feature.properties.feature_name+"<br/>Average Earning Bracket: "+earnersSummary[0].scale+"<br/>Total Earners: "+
			                  earnersSummary[1].value+"<br/>Percentage: "+percentage.toFixed(2);
			  layer.bindPopup(popUpInfo);
			  mapSuburbs.push(layer);
		  }
	 </script>
</body>
</html>