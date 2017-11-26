

class Graph {
  constructor() {
    this.num_nodes = 0;
    this.num_links = 0;
    this.nodes = null;
    this.links = null;
    this.total_weight = 0;
  }

  load(nodes, links) {
    this.num_nodes = nodes.length;
    this.num_links = links.length;
    this.nodes = nodes;
    this.links = links;
    this.sanitize();

    this.total_weight = _.sumBy(this.links, 'w');
    // console.log('links', links);
  }

  sanitize() {
    this.links.forEach( link => {
      if (link.hasOwnProperty('w') === false) {
        link.w = 1;
      }
    });
  }

  getNeighbours(node) {
    let links = this.links.filter( link => {
      return (link.from === node || link.to === node) && (link.from !== link.to);
    });

    return _.uniq(_.flatten(
      links.map(d=>d.from),
      links.map(d=>d.to)
    ).filter(d => d !== node));
  }

  /**
   * Returns 0 if no self loop, else return the weight of the self loop
   **/
  getSelfLoops(node) {
    let links = this.links.filter( link => {
      return link.from === node && link.to === node;
    });
    if (links.length === 1) {
      return links[0].w;
    }
    return 0;
  }

  /**
   * Get the degree of the node, ignore self loops
   **/
  getWeightedDegree(node) {
    let links = this.links.filter( link => {
      return (link.from === node || link.to === node) && (link.from !== link.to);
    });
    return _.sumBy(links, 'w');
  }


  printStats() {
    console.log('Graph');
    console.log('\t # nodes', this.num_nodes);
    console.log('\t # links', this.num_links);
    console.log('\t total weight', this.total_weight);
  }
  
}
