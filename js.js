var dealsizeChart = dc.rowChart("#dealsize"),
		 territoryChart = dc.rowChart("#TERRITORY"),
		 orderdataCount = dc.dataCount(".dc-data-count"),
		 orderdataTable = dc.dataTable(".dc-data-table");



		d3.csv("/sales_data_sample.csv", function(err, data) {
			if (err) throw err;
			
			
			
			data.forEach(function(d) {
				d.ORDERDATE = new Date (d.ORDERDATE);
			});
			
			var ndx = crossfilter(data);
			var all = ndx.groupAll();


			var dealsizeDim = ndx.dimension(function(d) { return d["DEAL-SIZE"]; });

			var territoryDim = ndx.dimension(function(d) { return d["TERRITORY"]; });
			
			var dateDim = ndx.dimension(function(d) { return d.ORDERDATE });

			var dealsizeGroup = dealsizeDim.group();

			var territoryGroup = territoryDim.group();
			
			

			dealsizeChart
				.dimension(dealsizeDim)
				.group(dealsizeGroup)
				.elasticX(true);


			territoryChart
				.dimension(territoryDim)
				.group(territoryGroup)
				.elasticX(true);
				
			orderdataCount	
			.dimension(ndx)
			.group(all);
			
			orderdataTable
			.dimension(dateDim)
			// Data table does not use crossfilter group but rather a closure
        // as a grouping function
			.group(function (d) {
            var format = d3.format('02d');
            return d.ORDERDATE.getMonth() + '/' + format((d.ORDERDATE.getDay() + d.ORDERDATE.getFullYear()+1));
        })
			.columns ([
				"ORDERDATE" ,
				"PRODUCTLINE" ,
				"CITY",
				"COUNTRY"
				]);
				
				
				


			dc.renderAll();



		});
		
		
		
		 queue()
                .defer(d3.csv, "/sales_data_sample.csv")
                .await(makeGraphs);

            function makeGraphs(error, SALESData) {
                var ndx = crossfilter(SALESData)




        show_gender_balance(ndx);
        
        
        
          dc.renderAll();
          
          
                function show_gender_balance(ndx) {
                    var dim = ndx.dimension(dc.pluck("MONTH_ID"));
                    var group = dim.group();

                    dc.barChart("#chart-here")
                        .width(500)
                        .height(500)
                        .margins({ top: 10, right: 50, bottom: 60, left: 80 })
                        .dimension(dim)
                        .group(group)
                        .transitionDuration(500)
                        .x(d3.scale.ordinal().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).range([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]))
                        .xUnits(dc.units.ordinal)
                        .elasticY(true)
                        .xAxisLabel("COUNTRY")
                        .renderHorizontalGridLines(true)
                        .on('renderlet', function(chart) {
                            chart.selectAll("g.x text")
                                .attr('dx', '-15')
                                .attr('transform', "rotate(-45)");
                        })
                        .addFilterHandler(function(filters, filter) { return [filter]; })
                        .yAxis().ticks(20);


                }
}