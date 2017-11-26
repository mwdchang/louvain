/**
 * Wrapper around force directed layout 
 * 
 * Adapted from https://bl.ocks.org/mbostock/4062045
 *
 * Todo: self-links?
 * https://stackoverflow.com/questions/16358905/d3-force-layout-graph-self-linking-node
 **/
class Force {
  constructor(target, w, h) {
    this.target = target;
    this.w = w || 200;
    this.h = h || 200;
    this.svg = target.append('svg').attr('width', '100%').attr('height', '100%');
    this.svg.attr('viewBox', '0 0 ' + this.w + ' ' + this.h);

    this.color = d3.scaleOrdinal(d3.schemeCategory20);

    this.simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(this.w / 2, this.h / 2));
  }


  setData(nodes, links, lookup) {
    this.nodes = nodes.map(function(d) {
      return {
        id: d,
        group: 1,
        isSelfLink: _.some(links, link => link.from === d && link.to === d),
        size: lookup === null? 0 : lookup[d].length
      };
    });

    this.links = links.map(function(d) {
      return {
        source: d.from,
        target: d.to,
        value: 1.0
      };
    });
  }


  render() {
    let link = this.svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.links)
      .enter()
      .append("line")
      .attr("stroke-width", 1);

    let node = this.svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(this.nodes)
      .enter()
      .append("circle")
      .attr("r", d => {
        return 5 + d.size;
      })
      .attr("fill", '#E72')
      .attr('stroke', d => {
        return d.isSelfLink ? '#234' : '#fff';
      });

    node.append("title").text(function(d) { return d.id; });

    this.simulation.nodes(this.nodes).on("tick", ticked);
    this.simulation.force("link").links(this.links);

    function ticked() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }

  }
}
