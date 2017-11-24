class Community {

  constructor(graph, passes, minModularity) {
    this.graph = graph;
    this.node2community = {};
    this.inner = {};
    this.total = {};
    this.passes = passes;
    this.minModularity = minModularity;

    for (let i=0; i <this.graph.nodes.length; i++) {
      let n = this.graph.nodes[i];
      this.node2community[n] = i;
      this.inner[n] = graph.getSelfLoops(n);
      this.total[n] = graph.getWeightedDegree(n);
    }
  }

  getNeighbourCommunities(node) {
  }

  oneLevel() {
    let improved = false;
    let nodes = this.graph.nodes;
    let randomNodes = _.shuffle(nodes);
    let currentModularity = this.modularity();

    console.log('Pass');
    console.log('\tnodes ', nodes);
    console.log('\trandomized', randomNodes);

    let c = 0;
    while(true) {
      c++;
      if (c > 10) {
        break;
      }
    }
    return improved;
  }

  modularity2() {
    let q = 0;
    let m = this.graph.total_weight;

    this.graph.nodes.forEach( n => {
      if (this.total[n] > 0) {
        q += (this.inner[n] - this.total[n] * this.total[n] / (2*m))
      }
    });
    return q / (2*m);
  }

  modularity() {
    let q = 0;
    let m2 = this.graph.total_weight;

    this.graph.nodes.forEach( n => {
      if (this.total[n] > 0) {
        q += ( (this.inner[n]/m2) - Math.pow(this.total[n]/m2, 2) );
      }
    });
    return q;
  }


  modularityGain() {
  }

  printStats() {
    console.log('Community');
    Object.keys(this.node2community).sort().forEach( n => {
      console.log('\tnode='+ n, ' community=' + this.node2community[n], ' total=' + this.total[n], ' inner='+this.inner[n] );
    });
    console.log('\tmodularity', this.modularity());
    console.log('\tmodularity 2', this.modularity2());
  }


}
