/**
 * Created by VIPULD on 1/11/2016.
 */

"use strict";

define(["app"], function(app) {
    app.directive("doughnut",
        function() {
            return {
                restrict: 'A',
                scope: {
                    ngModel: '=',
                    donutdata:'='
                },
                link: function(scope, element, attrs){
                    var dataDonut = scope.donutdata;
                    var w = document.getElementsByTagName('ion-nav-view')[0].offsetWidth;

                    var ele =  element[0];
                    ele.style.height = (w+50)/2+"px";
                    ele.getElementsByClassName('donut')[0].innerHTML = '';
                    var svg = d3.select(ele)
                        .append("svg")
                        .append("g")
                    svg.append("g")
                        .attr("class", "slices");
                    svg.append("g")
                        .attr("class", "labels");
                    svg.append("g")
                        .attr("class", "lines");

                    var width = w-50,
                        height = w/2,
                        radius = Math.min(width, height) / 2;

                    var pie = d3.layout.pie()
                        .sort(null)
                        .value(function(d) {
                            return d.Balance;
                        });

                    var arc = d3.svg.arc()
                        .outerRadius(radius * 0.8)
                        .innerRadius(radius * 0.6);

                    var outerArc = d3.svg.arc()
                        .innerRadius(radius * 0.9)
                        .outerRadius(radius * 0.9);

                    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")").attr('height','100%').attr('width','100%');

                    var key = function(d){ return d.data.Name; };

                    var color = d3.scale.ordinal()
                        .range(['#8c5dbe', '#6c3c94', '#8f42c3', '#c086e2']);

                    change(dataDonut);

                    d3.select(".randomize")
                        .on("click", function(){
                            change(randomData());
                        });


                    function change(data) {

                        /* ------- PIE SLICES -------*/
                        var slice = svg.select(".slices").selectAll("path.slice")
                            .data(pie(data), key);

                        slice.enter()
                            .insert("path")
                            .style("fill", function(d) { return color(d.data.Name); })
                            .attr("class", "slice");

                        slice
                            .transition().duration(1000)
                            .attrTween("d", function(d) {
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                    return arc(interpolate(t));
                                };
                            })

                        slice.exit()
                            .remove();

                        /* ------- TEXT LABELS -------*/

                        var text = svg.select(".labels").selectAll("text")
                            .data(pie(data), key);

                        text.enter()
                            .append("text")
                            .style("font-size","0.75rem")
                            .attr("dy", ".35em")
                            .style("fill","#f8e097")
                            .each(function (d){
                                var arr = [d.data.Name, '$'+d.data.Balance];
                                for(var i = 0; i<2; i++){
                                    d3.select(this).append('tspan')
                                        .text(arr[i])
                                        .attr("dy", i!=0 ? "1.2em" : 0)
                                        .attr("x", 0)
                                        .attr("class", "tspan" + i);
                                }
                            })/*
                         .text(function(d) {
                         //return d.data.Name + '  $' + d.data.Balance;
                         return d.data.Name+'$'+d.data.Balance
                         })*/;

                        function midAngle(d){
                            return d.startAngle + (d.endAngle - d.startAngle)/2;
                        }

                        text.transition().duration(1000)
                            .attrTween("transform", function(d) {
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                    var d2 = interpolate(t);
                                    var pos = outerArc.centroid(d2);
                                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                                    return "translate("+ pos +")";
                                };
                            })
                            .styleTween("text-anchor", function(d){
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                    var d2 = interpolate(t);
                                    return midAngle(d2) < Math.PI ? "start":"end";
                                };
                            });

                        text.exit()
                            .remove();

                        /* ------- SLICE TO TEXT POLYLINES -------*/

                        var polyline = svg.select(".lines").selectAll("polyline")
                            .data(pie(data), key);

                        polyline.enter()
                            .append("polyline").style("fill","none").style("stroke","#f8e097");

                        polyline.transition().duration(1000)
                            .attrTween("points", function(d){
                                this._current = this._current || d;
                                var interpolate = d3.interpolate(this._current, d);
                                this._current = interpolate(0);
                                return function(t) {
                                    var d2 = interpolate(t);
                                    var pos = outerArc.centroid(d2);
                                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                                };
                            });

                        polyline.exit()
                            .remove();
                    };
                },
                templateUrl:"common/views/templates/doughnut.html"
            };
        }
    )
});
