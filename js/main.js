var chart = (function(window,d3) {

	d3.json("./js/dataset.json", function(error, data) {
	  if (error) throw error;

	  init(data);
	});

	function init(data) {

		var w = window.innerWidth;
		var h = window.innerHeight;

		var svg = d3.select('svg').attr('width', w).attr('height', h).classed('no-select', true);

		var simulation = d3.forceSimulation()
			.force('link', d3.forceLink().distance(40))
			.force('charge', d3.forceManyBody().distanceMin(1).strength(-98).distanceMax(80))
			.force('center', d3.forceCenter( w / 2, h / 2));

		var link = svg.append('g').classed('links', true)
			.selectAll('line')
			.data(data.links)
			.enter().append('line');

		var node = svg.append('g').classed('nodes', true)
			.selectAll('foreignObject')
			.data(data.nodes)
			.enter().append('foreignObject').classed('foreign', true)
				.attr("width", 32).attr("height", 32);


		node.append('xhtml:body')
			.style('transform', 'scale(0.7, 0.7)')
			.attr('class', function(d) { return 'flag flag-' + d.code})
			.call(d3.drag()
				.on('start', dragstarted)
				.on('drag', dragging)
				.on('end', dragended));

		var tooltip = d3.select('body')
			.append('div')
			.attr('class', 'hidden tooltip');

		node.select('.flag').on('mouseenter', function(d) {
		    var [x, y] = d3.mouse(document.body);
			tooltip
		        .style('top', y - 10 + 'px')
		        .style('left', x + 20 + 'px')
		        .classed('hidden', false)
		        .text(d.country);
		});

		node.select('.flag').on('mouseleave', function() {
			tooltip
			    .classed('hidden', true);
		})

		simulation
			.nodes(data.nodes)
			.on('tick', ticked);

		simulation.force('link')
			.links(data.links);

		function zoomed() {
			svg.attr("transform", d3.event.transform);
		}

		function ticked() {
			link
				.attr('x1', function(d) { return d.source.x; })
				.attr('y1', function(d) { return d.source.y; })
				.attr('x2', function(d) { return d.target.x; })
				.attr('y2', function(d) { return d.target.y; });

			node
				.attr('x', function(d) { return d.x - 16; })
				.attr('y', function(d) { return d.y - 16; })
		}

		function dragstarted(d) {
		  if (!d3.event.active) simulation.alphaTarget(0.1).restart();
		  d.fx = d.x;
		  d.fy = d.y;
		}

		function dragging(d) {console.log(d3.event.x);
		  d.fx = d3.event.x;
		  d.fy = d3.event.y;
		}

		function dragended(d) {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d.fx = null;
		  d.fy = null;
		}
	}

})(window,d3);
