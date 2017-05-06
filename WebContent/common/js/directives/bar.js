/**
 * Created by VIPULD on 1/11/2016.
 */

"use strict";

define(["app"], function(app) {
    app.directive("bar",
        function() {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                scope: {
                    month: '=',
                    bardata:'@'
                },
                link: function(scope, element, attrs){
                    var wd = document.getElementsByTagName('ion-nav-view')[0].offsetWidth;
                    var contHeight = (wd/2);
                    document.getElementById('dashboard').setAttribute("style","height:"+contHeight+ "px");
                    //element[0].style.height = (wd/2) + 50;
                    var freqData = JSON.parse(scope.bardata);
                    function dashboard(id, fData) {
                        var barColor = '#2c313d';
                        var border = '1px';
                        var bordercolor = '70e9f4';
                        var barMargin = '30px';

                        function segColor(c) {
                            return { low: "#8c5dbe", mid: "#6c3c94", high: "#8f42c3", highest: "#c086e2" }[c];
                        }

                        // compute total for each state.
                        fData.forEach(function (d) {
                            d.total = d.Balance;
                        });

                        // function to handle histogram.
                        function histoGram(fD) {
                            var hG = {},
                                hGDim = { t: 20, r: 0, b: 30, l: 0 };
                            hGDim.w = wd -50
                            hGDim.h = hGDim.w/3
                            //create svg for histogram.
                            var hGsvg = d3.select(id).append("svg")
                                .attr("width", hGDim.w)
                                .attr("height", hGDim.h).append("g")
                                .attr("transform", "translate(" + hGDim.l + "," + hGDim.b + ")");

                            // create function for x-axis mapping.
                            var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                                .domain(fD.map(function (d) { return d[0]; }));

                            // Add x-axis to the histogram svg.
                            hGsvg.append("g").attr("class", "x axis")
                                .attr("transform", "translate(0," + (hGDim.h + hGDim.t) + ")").style("fill", "white")
                                .call(d3.svg.axis().scale(x).orient("bottom"));

                            // Create function for y-axis map.
                            var y = d3.scale.linear().range([hGDim.h, 0])
                                .domain([0, d3.max(fD, function (d) { return d[1]; })]);

                            // Create bars for histogram to contain rectangles and freq labels.
                            var bars = hGsvg.selectAll(".bar").data(fD).enter()
                                .append("g").attr("class", "bar");

                            //create the rectangles.
                            bars.append("rect")
                                .attr("x", function (d) { return x(d[0]); })
                                .attr("y", function (d) { return y(d[1]) + 100; })
                                .attr("width", x.rangeBand())
                                .attr("id", function (d) { return (d[0]); })
                                .attr("height", function (d) { return hGDim.h/6 - y(d[1]); })
                                .attr('fill', barColor)
                                //.attr('margin-left', barMargin)
                                .style("stroke", bordercolor)
                                .style("stroke-width", border)
                                .on("mouseover", mouseover)// mouseover is defined below.
                                .on("mouseout", mouseout);// mouseout is defined below.

                            //Create the frequency labels above the rectangles.
                            bars.append("text").text(function (d) { return '$' + d3.format(",")(d[1]) })
                                .attr("x", function (d) { return x(d[0]) + x.rangeBand() / 2; })
                                .attr("y", function (d) { return y(d[1]) + 95; })
                                .attr("text-anchor", "middle")
                                .style("fill", "white");

                            function mouseover(d) {  // utility function to be called on mouseover.
                                // filter for selected state.
                                var st = fData.filter(function (s) { return s.Month == d[0]; })[0],
                                    nD = d3.keys(st.freq).map(function (s) { return { type: s, freq: st.freq[s] }; });

                                // call update functions of pie-chart and legend.
                                leg.update(nD);
                            }

                            function mouseout(d) {    // utility function to be called on mouseout.
                                // reset the pie-chart and legend.
                                leg.update(tF);
                            }

                            // create function to update the bars. This will be used by pie-chart.
                            hG.update = function (nD, color) {
                                // update the domain of the y-axis map to reflect change in frequencies.
                                y.domain([0, d3.max(nD, function (d) { return d[1]; })]);

                                // Attach the new data to the bars.
                                var bars = hGsvg.selectAll(".bar").data(nD);

                                // transition the height and color of rectangles.
                                bars.select("rect").transition().duration(500)
                                    .attr("y", function (d) { return y(d[1]); })
                                    .attr("height", function (d) { return hGDim.h - y(d[1]); })
                                    .attr("fill", color);

                                // transition the frequency labels location and change value.
                                bars.select("text").transition().duration(500)
                                    .text(function (d) { return d3.format(",")(d[1]) })
                                    .attr("y", function (d) { return y(d[1]) - 5; });
                            }
                            return hG;
                        }


                        // calculate total frequency by segment for all state.
                       /* var tF = ['low', 'mid', 'high', 'highest'].map(function (d) {
                            return { type: d, freq: d3.sum(fData.map(function (t) { return t.freq[d]; })) };
                        });*/

                        // calculate total frequency by state for all segment.
                        var sF = fData.map(function (d) { return [d.Month, d.total]; });

                        var hG = histoGram(sF) // create the histogram.
                        document.getElementById(scope.month).setAttribute('fill','#70e9f4');
                        document.getElementById(scope.month).nextSibling.setAttribute('style','fill:#70e9f4')
                    }
                    dashboard('#dashboard', freqData);
                },
                templateUrl:"common/views/templates/bar.html"
            };
        }
    )
});
