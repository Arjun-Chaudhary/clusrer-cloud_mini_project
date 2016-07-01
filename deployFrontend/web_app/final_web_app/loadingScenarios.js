
function loadScenarioData(num){
    loadIndidualScenario(num);
}
function loadIndidualScenario(num){
	var scenario = num;
   //Load variables if running for the first time
   document.getElementById("current_progress").innerHTML =	"Loading Scenario Data";
   if(scenario==1){
	   importFamilyData();	
   }else if(scenario==3){
	   importIncomeData();
   }
  if(scenario==2 && story2tweets==null || scenario==4 && story4tweets==null){
	$(document).ready(function(){
       var data = null;
	   if(scenario==1){
	     data = {"action": "1"};	
	   }else if(scenario==2){
		 data = {"action": "2"};
	   }else if(scenario==3){
		 data = {"action": "3"};
	   }else if(scenario==4){
		 data = {"action": "4"};
	   }
       data = $(this).serialize() + "&" + $.param(data);
       $.ajax({
         type: "POST",
         dataType: "json",
         url: "response.php", //Relative or absolute path to response.php file
         data: data,
         success: function(data) {
			document.getElementById("current_progress").innerHTML =	"Scenario Tweets Loaded";	
			if(scenario==1){
				story1tweets = data;
				importFamilyData();	
			}else if(scenario==2){
		        story2tweets = data;
				loadSuburbCount(2);
	        }else if(scenario==3){
		        story3tweets = data;
				importIncomeData();
	        }else if(scenario==4){
				story4tweets = data;
				loadSuburbCount(4);
			}	
         },
		 error: function(XMLHttpRequest, textStatus, errorThrown) {
             document.getElementById("modal").innerHTML = "<p>An error occured while loading scenario data<br/><input type='button' class='button' value='Close' onclick='closeModal()'></p>";
             console.log("Status: "+textStatus+" Error: "+errorThrown);
		 }
        });
    });
  }else{
	 if(scenario==2){
		loadSuburbCount(2);
	 }else if(scenario==4){
		 loadSuburbCount(4);
	 }	
  }
}

function loadPositiveData(num){
	document.getElementById("current_progress").innerHTML =	"Loading Started";
	var scenario = num;
	$(document).ready(function(){
       var data = null;
	   if(scenario==1){
	     data = {"action": "story1Positive"};	
	   }else if(scenario==2){
		 data = {"action": "story2Positive"};
	   }else if(scenario==3){
		 data = {"action": "story3Positive"};
	   }else if(scenario==4){
		 data = {"action": "story4Positive"};
	   }
       data = $(this).serialize() + "&" + $.param(data);
       $.ajax({
         type: "POST",
         dataType: "json",
         url: "response.php", //Relative or absolute path to response.php file
         data: data,
         success: function(data) {

			if(scenario==1){
				story1positiveTweets = data;
			}else if(scenario==2){
		        story2positiveTweets = data;
	        }else if(scenario==3){
		        story3positiveTweets = data;
	        }else if(scenario==4){
		        story4positiveTweets = data;
	        }  
		    document.getElementById("current_progress").innerHTML =	"Positive Tweets Loaded";	
			loadNegativeData(scenario);
         },
		 error: function(XMLHttpRequest, textStatus, errorThrown) {
             document.getElementById("modal").innerHTML = "<p>An error occured while loading positive tweets data<br/><input type='button' class='button' value='Close' onclick='closeModal()'></p>";
             console.log("Status: "+textStatus+" Error: "+errorThrown);
		 }
        });
    });
}

function loadNegativeData(num){
	var scenario = num;
	$(document).ready(function(){
       var data = null;
	   if(scenario==1){
	     data = {"action": "story1Negative"};	
	   }else if(scenario==2){
		 data = {"action": "story2Negative"};
	   }else if(scenario==3){
		 data = {"action": "story3Negative"};
	   }else if(scenario==4){
		 data = {"action": "story4Negative"};
	   }
       data = $(this).serialize() + "&" + $.param(data);
       $.ajax({
         type: "POST",
         dataType: "json",
         url: "response.php", //Relative or absolute path to response.php file
         data: data,
         success: function(data) {
            //alert(JSON.stringify(data));
			if(scenario==1){
				story1negativeTweets = data;
			}else if(scenario==2){
		        story2negativeTweets = data;
	        }else if(scenario==3){
		        story3negativeTweets = data;
	        }else if(scenario==4){
		        story4negativeTweets = data;
	        }   
            //alert("Loaded Negative Data Tweets");				
			document.getElementById("current_progress").innerHTML =	"Negative Tweets Loaded";
			loadIndidualScenario(scenario);
         },
		 error: function(XMLHttpRequest, textStatus, errorThrown) {
             document.getElementById("modal").innerHTML = "<p>An error occured while loading negative tweets data<br/><input type='button' class='button' value='Close' onclick='closeModal()'></p>";
             console.log("Status: "+textStatus+" Error: "+errorThrown);
		 }
        });
    });
}

function importFamilyData(){
  if(familyMapArray==null){

	$(document).ready(function(){
       var data = {"action": "family"};	
       data = $(this).serialize() + "&" + $.param(data);
       $.ajax({
         type: "POST",
         dataType: "json",
         url: "response.php", //Relative or absolute path to response.php file
         data: data,
         success: function(data) {

			familyMapArray = data;  

			loadFamilyData();
			document.getElementById("current_progress").innerHTML =	"Family Data Loaded";
			if(currentScenario==1){
				loadChart();
				document.getElementById("side_info").innerHTML = scenario1Narrative;
			   document.getElementById("side_summary").innerHTML = "<p>Total Positive Tweets: "+totalPositive+"<br/>Total Negative Tweets: "+totalNegative+
			    "<br/>Total Suburbs Assumption 1: "+totalMoreChild+"<br/>Total Suburbs Assumption 2: "+totalNoChild+"<br/>Total Other Suburbs:"+totalOtherSub+"<br/>Total Positive Tweets Assumption 1: "+
			    totalPositiveSc1+"<br/>Total Negative Tweets Assumption 2: "+totalNegativeSc1+"</p>";
			}else{
				var end = twitterSuburbSpreadArray.length - 1;
				document.getElementById("side_summary").innerHTML = "<p>Most Active Suburb: "+twitterSuburbSpreadArray[0].suburb+"<br/>Least Active Suburb: "+twitterSuburbSpreadArray[end].suburb+"<br/>Total Tweets: "+totalSuburbTweets+"</p>";
				loadTweets(story4tweets);
		        loadSuburbChart();	
		        //var end = twitterSuburbSpreadArray.length - 1;
		        //var msg = "<p>Total Tweets: "+totalSuburbTweets+"</p>";
			}
			document.getElementById("current_progress").innerHTML =	"Loading Family Map";
         },
		 error: function(XMLHttpRequest, textStatus, errorThrown) {
             document.getElementById("modal").innerHTML = "<p>An error occured while loading family map data<br/><input type='button' class='button' value='Close' onclick='closeModal()'></p>";
             console.log("Status: "+textStatus+" Error: "+errorThrown);
		 }
        });
    });
  }else{
	document.getElementById("current_progress").innerHTML =	"Loading Family Map";
	loadFamilyData();
	//loadChart();
	if(currentScenario==1){
		loadChart();
		document.getElementById("side_info").innerHTML = scenario1Narrative;
		document.getElementById("side_summary").innerHTML = "<p>Total Positive Tweets: "+totalPositive+"<br/>Total Negative Tweets: "+totalNegative+
			    "<br/>Total Suburbs Assumption 1: "+totalMoreChild+"<br/>Total Suburbs Assumption 2: "+totalNoChild+"<br/>Total Positive Tweets Assumption 1: "+
			    totalPositiveSc1+"<br/>Total Negative Tweets Assumption 2: "+totalNegativeSc1+"</p>";
	}else{
		var end = twitterSuburbSpreadArray.length - 1;
		document.getElementById("side_summary").innerHTML = "<p>Most Active Suburb: "+twitterSuburbSpreadArray[0].suburb+"<br/>Least Active Suburb: "+twitterSuburbSpreadArray[end].suburb+"<br/>Total Tweets: "+totalSuburbTweets+"</p>";
		loadTweets(story4tweets);
		loadSuburbChart();	
		        //var end = twitterSuburbSpreadArray.length - 1;
		        //var msg = "<p>Total Tweets: "+totalSuburbTweets+"</p>";
	}
  }
}

function importIncomeData(){
  if(incomeMapArray==null){
	 // alert("Beginning Income Import");
	$(document).ready(function(){
       var data = {"action": "income"};	
       data = $(this).serialize() + "&" + $.param(data);
       $.ajax({
         type: "POST",
         dataType: "json",
         url: "response.php", //Relative or absolute path to response.php file
         data: data,
         success: function(data) {

			incomeMapArray = data;

            document.getElementById("current_progress").innerHTML =	"Income Data Loaded";
			if(currentScenario==2){
		      loadIncomeTweetsChartData(story2positiveTweets, story2negativeTweets);
			  loadTweets(story2tweets);
			  
			  var totLow = totalTweets - totalMed - totalHigh;
			  document.getElementById("side_summary").innerHTML = "<p>Total Positive Tweets: "+totalPositive+"<br/>Total Negative Tweets: "+totalNegative+
			"<br/>Code Highest Tweets: "+happiestSuburb+"<br/>Code Lowest Tweets: "+unhappiestSuburb+"<br/>Total Low: "+totLow+"<br/>Total Medium: "+
			totalMed+"<br/>Total High: "+totalHigh+"</p>";
		    }else if(currentScenario==3){
		      loadIncomeTweetsChartData(story3positiveTweets, story3negativeTweets);

			 document.getElementById("side_summary").innerHTML = "<p>Total Positive Tweets: "+totalPositive+"<br/>Total Negative Tweets: "+totalNegative+
			"<br/>Total Happy Rich Block IDs: "+totalHappyRich+"<br/>Total Unhappy Rich Block IDs: "+totalSadRich+"<br/>Total Happy Poor Block IDs: "+totalHappyOther+
			"<br/>Total Unhappy Poor Block IDs: "+totalSadOther+"<br/>Total Happy Medium Block IDs: "+totalHappyMed+"<br/>Total Sad Medium Block IDs: "+totalSadMed+"</p>";
			}
			
         },
		 error: function(XMLHttpRequest, textStatus, errorThrown) {
             document.getElementById("modal").innerHTML = "<p>An error occured while loading income data<br/><input type='button' class='button' value='Close' onclick='closeModal()'></p>";
             console.log("Status: "+textStatus+" Error: "+errorThrown);
		 }
        });
    });
  }else{
	  if(currentScenario==2){
		loadIncomeTweetsChartData(story2positiveTweets, story2negativeTweets);
		loadTweets(story2tweets);
		var totLow = totalTweets - totalMed - totalHigh;
		
        document.getElementById("side_summary").innerHTML = "<p>Total Positive Tweets: "+totalPositive+"<br/>Total Negative Tweets: "+totalNegative+
			"<br/>Code Highest Tweets: "+happiestSuburb+"<br/>Code Lowest Tweets: "+unhappiestSuburb+"<br/>Total Low: "+totLow+"<br/>Total Medium: "+
			totalMed+"<br/>Total High: "+totalHigh+"</p>";
	  }else if(currentScenario==3){
		loadIncomeTweetsChartData(story3positiveTweets, story3negativeTweets);
		//loadTweets(story3tweets);
		
		document.getElementById("side_summary").innerHTML = "<p>Total Positive Tweets: "+totalPositive+"<br/>Total Negative Tweets: "+totalNegative+
			"<br/>Total Happy Rich Block IDs: "+totalHappyRich+"<br/>Total Unhappy Rich Block IDs: "+totalSadRich+"<br/>Total Happy Poor Block IDs: "+totalHappyOther+
			"<br/>Total Unhappy Poor Block IDs: "+totalSadOther+"<br/>Total Happy Medium Block IDs: "+totalHappyMed+"<br/>Total Sad Medium Block IDs: "+totalSadMed+"</p>";
	  }	
	  
  }
  
}

//This loads the tweets summary for a suburb
function loadSuburbCount(num){
	$(document).ready(function(){
       var data = null;	
	   if(num==2){
		   data = {"action": "story2Suburb"};	
	   }else{
		   data = {"action": "story4Suburb"};	
	   }
       data = $(this).serialize() + "&" + $.param(data);
       $.ajax({
         type: "POST",
         dataType: "json",
         url: "response.php", //Relative or absolute path to response.php file
         data: data,
         success: function(data) {
			twitterSuburbSpread = data;
            loadIncomeTweetSpread();			
         },
		 error: function(XMLHttpRequest, textStatus, errorThrown) {
             document.getElementById("modal").innerHTML = "<p>An error occured while loading suburb count data<br/><input type='button' class='button' value='Close' onclick='closeModal()'></p>";
             console.log("Status: "+textStatus+" Error: "+errorThrown);
		 }
        });
    });
}

//This loads the summaries of the number of tweets in each suburb for income
function loadIncomeTweetSpread(){
	obj = twitterSuburbSpread;
	for (var i = 0; i < obj.rows.length; i++) {
		var document = obj.rows[i];
		twitterSuburbSpreadArray.push({ "suburb": document.key, "total": document.value}); 
	}

				twitterSuburbSpreadArray.sort(function(a, b) {
                   return b.total - a.total;
                });
				happiestSuburb = twitterSuburbSpreadArray[0].suburb;
				twitterSuburbSpreadArray.sort(function(a, b) {
                   return a.total - b.total;
                });
				unhappiestSuburb = twitterSuburbSpreadArray[0].suburb;
	if(currentScenario==2){
		importIncomeData();
	}else{
		twitterSuburbSpreadArray.sort(function(a, b) {
                   return b.total - a.total;
                });
		importFamilyData();
	}	
}

//This loads a d3 chart into the browser 
 function loadChart() {

			suburbTweets.sort(function(a, b) {
                return b.happy - a.happy;
            });
			
			var data = suburbTweets.slice(0, 9);

            var margin = {top: 70, right: 20, bottom: 130, left: 80},
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
                    .attr("transform", "rotate(0)")
                    .attr("y", 6)
					.attr("dx", "-.8em")
                    .attr("dy", "-.6em")
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
			svg.append("text")
                    .attr("x", (width / 2))             
                    .attr("y", 0 - (margin.top/4))
                    .attr("text-anchor", "middle")  
                    .style("font-size", "20px") 
                    .style("text-decoration", "underline")  
                    .text("Top 10 Suburbs Happy/Sad Tweets");
					
					d3.select("#chart").on('resize', resize); 
        }
		//This loads a d3 chart into the browser for income data
function loadIncomeChart() {

			suburbTweets.sort(function(a, b) {
                return b.happy - a.happy;
            });
			
			var data = suburbTweets.slice(0, 9);

            var margin = {top: 70, right: 20, bottom: 130, left: 80},
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
                    .attr("transform", "rotate(0)")
                    .attr("y", 6)
					.attr("dx", "-.8em")
                    .attr("dy", "-.6em")
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
			svg.append("text")
                    .attr("x", (width / 2))             
                    .attr("y", 0 - (margin.top/4))
                    .attr("text-anchor", "middle")  
                    .style("font-size", "20px") 
                    .style("text-decoration", "underline")  
                    .text("Top 10 Blocks Happy/Sad Tweets");
			d3.select("#chart").on('resize', resize); 
        }
function loadSuburbChart(){
	twitterSuburbSpreadArray.sort(function(a, b) {
                return b.total - a.total;
            });
			var data = twitterSuburbSpreadArray.slice(0, 9);
			var ceiling = data[0].total + 10;
            var margin = {top: 20, right: 20, bottom: 130, left: 80},
                width = 900 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;
            var y = d3.scale.linear()
               .domain(d3.extent(data, function(d) { return d.total; }))
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
                    .attr("transform", "rotate(0)")
                    .attr("y", 6)
					.attr("dx", "-.8em")
                    .attr("dy", "-.6em")
                    .style("text-anchor", "end")
                    .text("Total");
            svg.selectAll(".barsuccess")
                    .data(d3.entries(data))
                .enter().append("rect")
                    .attr("class", "barsuccess")
                    .attr("x", function(d) { return x(d.key) })
                    .attr("width", x.rangeBand()/2)
                    .attr("y", function(d) { return y(d.value.total); })
                    .attr("height", function(d) { return height - y(d.value.total); })
                    .style( "fill", "blue" );
            bar.append("text")
                    .attr("x", function(d) { return x(d.key) + x.rangeBand() / 2; })
                    .attr("dx", -3) // padding-right
                    .attr("dy", ".35em") // vertical-align: middle
                    .attr("text-anchor", "end") // text-align: right
                    .text( function(d) { console.log( d.value.suburb ); return d.value.suburb; });
			svg.append("text")
                    .attr("x", (width / 2))             
                    .attr("y", 0 - (margin.top/4))
                    .attr("text-anchor", "middle")  
                    .style("font-size", "20px") 
                    .style("text-decoration", "underline")  
                    .text("Top 10 Suburbs By Tweets");
					
			d3.select("#chart").on('resize', resize); 
}


function resize() {
    // update width
    width = parseInt(d3.select('#chart').style('width'), 10);
    width = width - margin.left - margin.right;

    // resize the chart
    x.range([0, width]);
    d3.select(chart.node().parentNode)
        .style('height', (y.rangeExtent()[1] + margin.top + margin.bottom) + 'px')
        .style('width', (width + margin.left + margin.right) + 'px');

    chart.selectAll('rect.background')
        .attr('width', width);

    chart.selectAll('rect.percent')
        .attr('width', function(d) { return x(d.percent); });

    // update median ticks
    var median = d3.median(chart.selectAll('.bar').data(), 
        function(d) { return d.percent; });

    chart.selectAll('line.median')
        .attr('x1', x(median))
        .attr('x2', x(median));


    // update axes
    chart.select('.x.axis.top').call(xAxis.orient('top'));
    chart.select('.x.axis.bottom').call(xAxis.orient('bottom'));

}
//This creates the data for the scale
function loadIncomeTweetsChartData(positive, negative){
	   var obj = positive;
	   var obj2 = negative;
	   for (var i = 0; i < obj.rows.length; i++) {
		   var document = obj.rows[i];
		   suburbTweets.push({ "suburb": document.key, "happy": document.value, "sad": 0 });
		   totalPositive = totalPositive + document.value;   
	   }

	   for (var i = 0; i < obj2.rows.length; i++) {
		   var document = obj2.rows[i];
			   var notFound = false;
			   for (var j = 0; j < suburbTweets.length && !notFound; j++) {
			       if(suburbTweets[j].suburb==document.key){
					    suburbTweets[j].sad = document.value; 
                        notFound = true;						
				   }
			   }
			   if(!notFound)
				   suburbTweets.push({ "suburb": document.key, "happy": 0, "sad": document.value });
			   
		   totalNegative = totalNegative + document.value; 
	   }
	   suburbTweets.sort(function(a, b) {
                     return b.happy - a.happy;
                  });
	   loadIncomeData();
	   loadIncomeChart();
}
//This displays the modal pop up
$(function(){

var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");

  $('a[data-modal-id]').click(function(e) {
    e.preventDefault();
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    //$(".js-modalbox").fadeIn(500);
    var modalBox = $(this).attr('data-modal-id');
    $('#'+modalBox).fadeIn($(this).data());
  });  
  
  
$(".js-modal-close, .modal-overlay").click(function() {
  $(".modal-box, .modal-overlay").fadeOut(500, function() {
    $(".modal-overlay").remove();
  });
});
 
$(window).resize(function() {
  $(".modal-box").css({
    top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
    left: ($(window).width() - $(".modal-box").outerWidth()) / 2
  });
});
 
$(window).resize();
 
});

function openModal() {
        document.getElementById('modal').style.display = 'block';
        document.getElementById('fade').style.display = 'block';
}

function closeModal() {
	document.getElementById('modal').innerHTML = "<img id='loader' width='130px' height='130px' src='loading.gif' /><div id='current_progress'></div>";
    document.getElementById('modal').style.display = 'none';
    document.getElementById('fade').style.display = 'none';
}