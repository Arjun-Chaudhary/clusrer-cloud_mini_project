// Read the GeoJSON data with jQuery, and create a circleMarker element for each tweet
        // Each tweet will be represented by a nice red dot
		var tweetsMarkers = new Array();
		$('a.tweets').click(
		function (){
          if(!viewTweets){	  
          /** $.getJSON('data/geo_data.json', function(json) {
			  $.each(json.features, function(key, val){
				  var lon = val.geometry.coordinates[0];
                  var lat = val.geometry.coordinates[1];
				  L.circle([lon, lat], 50, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.5
                  }).addTo(mymap);
			  });
            });**/
			/**$.getJSON('data/geo_data_bigData.json', function(json) {
			  $.each(json, function(key, val){
				 var LatLang = val.split(",");
				  var lat = LatLang[0];
                  var lon = LatLang[1];
				  var tweet = L.circle([lon, lat], 1, {
                    color: 'red',
                    fillColor: '#f03',
                    fillOpacity: 0.1
                  }).addTo(mymap);
				  tweetsMarkers.push(tweet);
			   });
            });**/
			var filePath = 'data/polarFile.json';
            xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET",filePath,false);
            xmlhttp.send(null);
            var fileContent = xmlhttp.responseText;
            var fileArray = fileContent.split('\n');
		
		    for (var i in fileArray) {
               var obj = JSON.parse(fileArray[i]);
			   var lat = obj.coordinates[0];
               var lon = obj.coordinates[1];
			   var tcolor = 'red';
			   if(obj.polarity==1){
				 tcolor = 'green';
			   }else if(obj.polarity==0){
				 tcolor = 'blue';
			   }
			   var tweet = L.circle([lon, lat], 50, {
                    color: tcolor,
                    fillColor: '#f03',
                    fillOpacity: 0.1
                  }).addTo(mymap).bindPopup("Tweet: "+obj.text);
				  tweetsMarkers.push(tweet);
            }
			viewTweets = true;
		  }else{
		     for(i = 0; i < tweetsMarkers.length; i++){
		        mymap.removeLayer(tweetsMarkers[i]);
			}
			tweetsMarkers = [];
			viewTweets = false;
		  }
        });
		//Reads the income data and creates polygon on the map
		var geoLayer;
		var incomeLink = $('a.income').click(
        function () {
         if(!viewIncome){		
           $.getJSON('data/income_data.json', function(json) {
			  var geojsonMarkerOptions = {
              radius: 1,
              fillColor: "#ff7800",
              color: "#000",
              weight: 0.1,
              opacity: 0.1,
              fillOpacity: 0.1
           };

           geoLayer = L.geoJson(json, {
                  onEachFeature: onEachFeature
               }).addTo(mymap);
           });
		   viewIncome = true;
		  }else{
		    mymap.removeLayer(geoLayer);
			viewIncome = false;
		  }
        });
		function onEachFeature(feature, layer) {
			 var popUpInfo = "Suburb Name: "+feature.properties.feature_name+"<br/> Year: "+feature.properties.TIME+"<br/> One Parent Family: "+
			                 feature.properties.MEASURE_3+"<br/> Couple family with Children: "+feature.properties.MEASURE_2+"<br/>Couple family with no children: "+
							 feature.properties.MEASURE_1+"<br/>Couple family Total: "+feature.properties.MEASURE_CF+"<br/>Other family: "+feature.properties.MEASURE_9;
             layer.bindPopup(popUpInfo);
        }