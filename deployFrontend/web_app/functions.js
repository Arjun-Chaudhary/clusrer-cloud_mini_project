function loadScenarioData(num){
		    var scenario = null;
			//Remove any existing tweets
			removePreviousData();
			if(num==1){
			    loadFamilyData();
				loadChart();
			}else if(num==2){
				loadIncomeData();
			   loadTweets(<?php echo $story2JSON;?>);
			   
			   //loadIncomeChart();
			}else if(num==3){
			   loadTweets(<?php echo $story3JSON;?>);
			   loadIncomeData();
			   //loadIncomeChart();
			}
		}
		
		function loadTweets(scenario){
			var obj = scenario;
			currentScenario = scenario;
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
                var tweet = L.circle([lon, lat], 20, {
                    color: colorTweet,
                    fillColor: colorTweet,
                    fillOpacity: 0.9
                  }).addTo(mymap).bindPopup("Tweet: "+tweet.text+"<br/>Suburb: "+tweet.suburb_code);
				  tweetsMarkers.push(tweet);
             }
		}
		
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
			for(i = 0; i < mapPolarityMarkers.length; i++){
		        mymap.removeLayer(mapPolarityMarkers[i]);
			}
			mapPolarityMarkers = [];
			//Remove the chart
			document.getElementById("chart").innerHTML = "";
		}
		
		//This loads the family data into the suburbs
		function loadFamilyData(){
		    var obj = <?php echo $familyJSON; ?>;
			for (var i = 0; i < obj.rows.length; i++) {
				var document = obj.rows[i];
				var tweet = document.key;
				var geoLayer = L.geoJson(tweet, {
                  onEachFeature: onEachFeature
                }).addTo(mymap);
			}
		}
		
		//This loads the income data into the suburbs
		function loadIncomeData(){
			var obj = <?php echo $incomeJSON; ?>;
			for (var i = 0; i < obj.rows.length; i++) {
				var document = obj.rows[i];
				var tweet = document.key;
				var geoLayer = L.geoJson(tweet, {
                  onEachFeature:onEachIncomeFeature
                }).addTo(mymap);
			}
		}
		
		//This loads each individual family suburb data and binds data to the pop up 
		function onEachFeature(feature, layer) {
			  //Simple condition to change color according to scale
			  var tweets = <?php echo $story1JSON; ?>;
			  var fillColor = "#ffe6e6";
			  var familyData = new Array();
			  familyData.push({"family" : "one_parent", "value" : feature.properties.MEASURE_3});
			  familyData.push({"family" : "couple_children", "value" : feature.properties.MEASURE_2});
			  familyData.push({"family" : "couple_no_children", "value" : feature.properties.MEASURE_1});
			  familyData.push({"family" : "other_family", "value" : feature.properties.MEASURE_9});
			  familyData.sort(function(a, b) {
                return b.value - a.value;
              });
			  if(familyData[0].family=="one_parent"){
				  fillColor = "#ff8080";
			  }else if(familyData[0].family=="couple_children"){
				  fillColor = "##ff0000";
			  } else if(familyData[0].family=="couple_no_children"){
				  fillColor = "#4d0000";
			  }
			  layer.setStyle({
				  fillColor: fillColor,
				  opacity: 0.9
			  });
			  //Calculates the total number of positive, negative and neutral tweets of each suburb
			 var positiveTweets = 0;
			 var negativeTweets = 0;
			 var neutralTweets = 0;
			 for (var i = 0; i < tweets.rows.length; i++) {
				var document = tweets.rows[i];
				var tweet = document.key;
				if(tweet.suburb.localeCompare(feature.properties.feature_name)==0){
				   if(tweet.polarity_final_score==1){
					  positiveTweets++;
				   }else if(tweet.polarity_final_score==-1){
					  negativeTweets++;
				   }else{
					  neutralTweets++;
				   }
				}
             }
			 suburbTweets.push({ "suburb": feature.properties.feature_name, "happy": positiveTweets, "sad": negativeTweets });
			 //Return center of the suburb
			 // Get bounds of polygon
             var bounds = layer.getBounds();
            // Get center of bounds
            var center = bounds.getCenter();
			 var polarityMarker = null;
			 if(positiveTweets>negativeTweets){
			     polarityMarker = L.marker([0,0], {icon: tickIcon}).addTo(mymap);
				 polarityMarker.setLatLng(center);
			 }else{
				 polarityMarker = L.marker([0,0], {icon: crossIcon}).addTo(mymap);
				 polarityMarker.setLatLng(center);
			 }
			 mapPolarityMarkers.push(polarityMarker);
			 var popUpInfo = "Suburb Name: "+feature.properties.feature_name+"<br/> Year: "+feature.properties.TIME+"<br/> One Parent Family: "+
			                 feature.properties.MEASURE_3+"<br/> Couple family with Children: "+feature.properties.MEASURE_2+"<br/>Couple family with no children: "+
							 feature.properties.MEASURE_1+"<br/>Couple family Total: "+feature.properties.MEASURE_CF+"<br/>Other family: "+feature.properties.MEASURE_9+
							 "<br/>Positive Tweets: "+positiveTweets+"<br/>Negative Tweets: "+negativeTweets+"<br/>Neutral: "+neutralTweets;
			 
             layer.bindPopup(popUpInfo);
			 mapSuburbs.push(layer);
          }
		  
		  //This binds popup data to each individual suburb for income
		  function onEachIncomeFeature(feature, layer){
			  var tweets = <?php echo $story2JSON; ?>;
			  if(currentScenario==3){
				  tweets = <?php echo $story3JSON; ?>;
			  }
			   //Calculates the total number of positive, negative and neutral tweets of each suburb
			 var positiveTweets = 0;
			 var negativeTweets = 0;
			 var neutralTweets = 0;
			 for (var i = 0; i < tweets.rows.length; i++) {
				var document = tweets.rows[i];
				var tweet = document.key;
				if(tweet.suburb_code==feature.properties.feature_name){
				   if(tweet.polarity_final_score==1){
					  positiveTweets++;
				   }else if(tweet.polarity_final_score==-1){
					  negativeTweets++;
				   }else{
					  neutralTweets++;
				   }
				}
              }
			  var earnersSummary = new Array();
			  var totalEarnersMale = feature.properties.M_1_199_Tot + feature.properties.M_200_299_Tot + feature.properties.M_300_399_Tot + feature.properties.M_400_599_Tot + feature.properties.M_600_799_Tot +
			                         feature.properties.M_800_999_Tot + feature.properties.M_1000_1249_Tot + feature.properties.M_1250_1499_Tot +
									 feature.properties.M_1500_1999_Tot + feature.properties.M_2000_more_Tot;
			  var totalEarnersFemale = feature.properties.F_1_199_Tot + feature.properties.F_200_299_Tot + feature.properties.F_300_399_Tot + feature.properties.F_400_599_Tot + feature.properties.F_600_799_Tot +
			                           feature.properties.F_800_999_Tot;
			  var suburbTotal = totalEarnersMale + totalEarnersFemale;				   
			  //Store data in an array and determine the average of the suburb
			  earnersSummary.push({ "scale": "Male $1-$199", "value": feature.properties.M_1_199_Tot});
			  earnersSummary.push({ "scale": "Male $200-$299", "value": feature.properties.M_200_299_Tot});
			  earnersSummary.push({ "scale": "Male $300-$399", "value": feature.properties.M_300_399_Tot});
			  earnersSummary.push({ "scale": "Male $400-$599", "value": feature.properties.M_400_599_Tot});
			  earnersSummary.push({ "scale": "Male $600-$799", "value": feature.properties.M_600_799_Tot});
			  earnersSummary.push({ "scale": "Male $800-$999", "value": feature.properties.M_800_999_Tot});
			  earnersSummary.push({ "scale": "Male $1000-$1249", "value": feature.properties.M_1000_1249_Tot});
			  earnersSummary.push({ "scale": "Male $1250-$1499", "value": feature.properties.M_1250_1499_Tot});
			  earnersSummary.push({ "scale": "Male $1500-$1999", "value": feature.properties.M_1500_1999_Tot});
			  earnersSummary.push({ "scale": "Male $2000 or more", "value": feature.properties.M_2000_more_Total});
			  earnersSummary.sort(function(a, b) {
                return b.value - a.value;
              });
			  var fillColor = null;
			  if(earnersSummary[0]=="Male $1-$199"){
				  var fillColor = "#990000";
			  }else if(earnersSummary[0].scale=="Male $200-$299"){
				  var fillColor = "#e60000";
			  }else if(earnersSummary[0].scale=="Male $300-$399"){
				  var fillColor = "#ff0000";
			  }else if(earnersSummary[0].scale=="Male $400-$599"){
				  var fillColor = "#ff3333";
			  }else if(earnersSummary[0].scale=="Male $600-$799"){
				  var fillColor = "#ff8080";
			  }else if(earnersSummary[0].scale=="Male $800-$999"){
				  var fillColor = "#0000b3";
			  }else if(earnersSummary[0].scale=="Male $1000-$1249"){
				  var fillColor = "#0000ff";
			  }else if(earnersSummary[0].scale=="Male $1250-$1499"){
				  var fillColor = "#6666ff";
			  }else if(earnersSummary[0].scale=="Male $1500-$1999"){
				  var fillColor = "#80ff80";
			  }else if(earnersSummary[0].scale=="Male $2000 or more"){
				  var fillColor = "#008000";
			  }
			  suburbTweets.push({ "suburb": feature.properties.feature_name, "happy": positiveTweets, "sad": negativeTweets });
			  
			  layer.setStyle({
				  fillColor: fillColor,
				  opacity: 0.9
			  });
			  var percentage = (earnersSummary[1].value/totalEarnersMale)*100;
			  var popUpInfo = "Suburb Name: "+feature.properties.feature_name+"<br/>Average Earning Bracket: "+earnersSummary[0].scale+"<br/>Total Earners: "+
			                  earnersSummary[1].value+"<br/>Percentage: "+percentage.toFixed(2)+"<br/>Positive Tweets: "+positiveTweets+"<br/>Negative Tweets: "+
							  negativeTweets;
			  layer.bindPopup(popUpInfo);
			  mapSuburbs.push(layer);
		  }
		  
		 //This loads a d3 chart into the browser 
         function loadChart() {
			suburbTweets.sort(function(a, b) {
                return b.happy - a.happy;
            });
			var data = suburbTweets.slice(0, 9);
			var ceiling = data[0].happy + 10;
            var margin = {top: 20, right: 20, bottom: 150, left: 80},
                width = 900 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
            var y = d3.scale.linear()
               .domain(d3.extent(data, function(d) { return d.happy; }))
               .range([height, 0]);
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1)
                .domain(d3.entries(data).map(function(d) { return d.value.suburb; }));
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
            var svg = d3.select("#chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
					.selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
              svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Total");
            svg.selectAll(".barsuccess")
                    .data(d3.entries(data))
                .enter().append("rect")
                    .attr("class", "barsuccess")
                    .attr("x", function(d) { return x(d.key) })
                    .attr("width", x.rangeBand()/2)
                    .attr("y", function(d) { return y(d.value.happy); })
                    .attr("height", function(d) { return height - y(d.value.happy); })
                    .style( "fill", "green" );
            var bar = svg.selectAll(".barfail")
                    .data(d3.entries(data))
                .enter().append("rect")
                    .attr("class", "barfail")
                    .attr("x", function(d) { return x(d.key) + x.rangeBand()/2 })
                    .attr("width", x.rangeBand()/2)
                    .attr("y", function(d) { return y(d.value.sad); })
                    .attr("height", function(d) { return height - y(d.value.sad ); })
                    .style( "fill", "red" );
            bar.append("text")
                    .attr("x", function(d) { return x(d.key) + x.rangeBand() / 2; })
                    .attr("dx", -3) // padding-right
                    .attr("dy", ".35em") // vertical-align: middle
                    .attr("text-anchor", "end") // text-align: right
                    .text( function(d) { console.log( d.value.suburb ); return d.value.suburb; });
        }
		//This loads a d3 chart into the browser for income data
         function loadIncomeChart() {
			suburbTweets.sort(function(a, b) {
                return b.happy - a.happy;
            });
			var data = suburbTweets.slice(0, 9);
			var ceiling = data[0].happy + 10;
            var margin = {top: 20, right: 20, bottom: 150, left: 80},
                width = 900 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
            var y = d3.scale.linear()
               .domain(d3.extent(data, function(d) { return d.happy; }))
               .range([height, 0]);
            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], .1)
                .domain(d3.entries(data).map(function(d) { return d.value.suburb; }));
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom");
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");
            var svg = d3.select("#chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
              svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
					.selectAll("text")	
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });
              svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Total");
            svg.selectAll(".barsuccess")
                    .data(d3.entries(data))
                .enter().append("rect")
                    .attr("class", "barsuccess")
                    .attr("x", function(d) { return x(d.key) })
                    .attr("width", x.rangeBand()/2)
                    .attr("y", function(d) { return y(d.value.happy); })
                    .attr("height", function(d) { return height - y(d.value.happy); })
                    .style( "fill", "green" );
            var bar = svg.selectAll(".barfail")
                    .data(d3.entries(data))
                .enter().append("rect")
                    .attr("class", "barfail")
                    .attr("x", function(d) { return x(d.key) + x.rangeBand()/2 })
                    .attr("width", x.rangeBand()/2)
                    .attr("y", function(d) { return y(d.value.sad); })
                    .attr("height", function(d) { return height - y(d.value.sad ); })
                    .style( "fill", "red" );
            bar.append("text")
                    .attr("x", function(d) { return x(d.key) + x.rangeBand() / 2; })
                    .attr("dx", -3) // padding-right
                    .attr("dy", ".35em") // vertical-align: middle
                    .attr("text-anchor", "end") // text-align: right
                    .text( function(d) { console.log( d.value.suburb ); return d.value.suburb; });
        }