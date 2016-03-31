jQuery(function($){
	
	/**
	* Custom select
	*/
	(function(){
		
		$('.fancybox').fancybox({
			'width':     '80%',
			'autoSize':  false,
			'maxWidth':  980,
			'padding':   [45, 45, 45, 45]
		});
		
	}());
	
	/**
	* Popover activate
	*/
	(function(){
		var $popover = $("[data-toggle=popover]");
		
		$popover.popover();
	
		$(document).on("click", ".popover-title", function() {
			$popover.filter("[aria-describedby^='popover']").trigger("click");
		});
	}());
	
	/**
	* Popover activate
	*/
	(function(){
		
		function forceChart() {
			
			var attributes = {
				'width':  400,
				'height': 350,
				'margin': {
					'top':    0,
					'right':  0,
					'bottom': 0,
					'left':   0
				},
				'color':   d3.scale.category10(),
				'charge':  -300,
				'gravity': 0.10
			};
			
			function chart(selection) {
				selection.each(function(data) {
					var div = d3.select(this),
						divID = div.attr('id'),
						svg = div.selectAll('svg').data([data]);
					
					var width   = chart.width(),
						height  = chart.height(),
						charge  = chart.charge(),
						gravity = chart.gravity();
					
					svg
						.enter()
						.append('svg')
						.attr('width', width)
						.attr('height', height)
						.call(chart.svgInit);
					
					var nodes = d3.range(10).map(function() { return {radius: /*Math.random()*/ 1 * 25}; }),
						root = nodes[0],
						color = d3.scale.category10();

					root.radius = 0;
					root.fixed = true;
					
					var force = d3.layout.force()
						.charge(charge)
						.gravity(gravity)
						//.charge(function(d, i) { return i ? 0 : -2000; })
						.nodes(nodes)
						.size([width, height]);

					force.start();

					svg.selectAll("circle")
						.data(nodes.slice(1))
						.enter().append("circle")
						.attr("r", function(d) { return d.radius; })
						.style("fill", function(d, i) { return "url(#image-" + (i + (('chartRight' != divID)?1:10)) + ")"; });

					force.on("tick", function(e) {
					  var q = d3.geom.quadtree(nodes),
						  i = 0,
						  n = nodes.length;

					  while (++i < n) q.visit(collide(nodes[i]));

					  svg.selectAll("circle")
						  .attr("cx", function(d) { return d.x; })
						  .attr("cy", function(d) { return d.y; });
					});

					svg.on("mousemove", function() {
					  var p1 = d3.mouse(this);
					  root.px = p1[0];
					  root.py = p1[1];
					  force.resume();
					});

					function collide(node) {
					  var r = node.radius + 16,
						  nx1 = node.x - r,
						  nx2 = node.x + r,
						  ny1 = node.y - r,
						  ny2 = node.y + r;
					  return function(quad, x1, y1, x2, y2) {
						if (quad.point && (quad.point !== node)) {
						  var x = node.x - quad.point.x,
							  y = node.y - quad.point.y,
							  l = Math.sqrt(x * x + y * y),
							  r = node.radius + quad.point.radius;
						  if (l < r) {
							l = (l - r) / l * .5;
							node.x -= x *= l;
							node.y -= y *= l;
							quad.point.x += x;
							quad.point.y += y;
						  }
						}
						return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
					  };
					}
					
					
				});
			}
			
			chart.svgInit = function(svg) {
				
				var defs = svg.append('defs');
				
				for(var i = 1, len = 20; i  < len; i++) {
					var pattern = defs
									.append('pattern')
									.attr('id', 'image-' + i)
									.attr('x', '0%')
									.attr('y', '0%')
									.attr('width', '100%')
									.attr('height', '100%')
									.attr('viewBox', '0 0 50 25');
					
					pattern
						.append('image')
						.attr('xlink:href', 'images/sprites/element-' + i + '.png')
						.attr('x', '0')
						.attr('y', '0')
						.attr('width', '50')
						.attr('height', '25');
					
				}
				
			}
			
			function createAccessor(attr) {
				function accessor(value) {
					if(!arguments.length) { return attributes[attr]; }
					attributes[attr] = value;
					return chart;
				}
				return accessor;
			}
			
			for(var attr in attributes) {
				if(!(chart[attr]) && attributes.hasOwnProperty(attr)) {
					chart[attr] = createAccessor(attr);
				}
			}
			
			return chart;
		}
		
		var chartLeft = forceChart(),
			chartRight = forceChart(),
			data = [];
			
			d3.select('#chartLeft').data([data]).call(chartLeft);
			
			d3.select('#chartRight').data([data]).call(chartRight);
			
	
	}());
	
});

