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
      this.inner[i] = graph.getSelfLoops(n);
      this.total[i] = graph.getWeightedDegree(n);
    }
  }

  getNeighbourCommunities(node) {
    let neighbours = this.graph.getNeighbours(node);
    console.log('getNeighbourCommunities', neighbours);

    let result = {};
    for (let i=0; i < neighbours.length; i++) {
      let neighbourNode = neighbours[i];
      let neighbourNodeCommunity = this.node2community[neighbourNode];
      let neighbourWeight = this.graph.getWeightedDegree(neighbourNode);

      result[neighbourNodeCommunity] = neighbourWeight;
    }

    // Put self
    result[this.node2community[node]] = this.graph.getWeightedDegree(node);
    return result;
  }

  insert(node, community, degreeNodeCommunity) {
    this.total[community] += this.graph.getWeightedDegree(node);
    this.inner[community] += 2*degreeNodeCommunity * this.graph.getSelfLoops(node);
    this.node2community[node]  = community;
  }

  remove(node, community, degreeNodeCommunity) {
    this.total[community] -= this.graph.getWeightedDegree(node);
    this.inner[community] -= 2*degreeNodeCommunity * this.graph.getSelfLoops(node);
    this.node2community[node]  = null;
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
      if (c > 1) {
        break;
      }

      for (let i=0; i < randomNodes.length; i++) {
        let node = randomNodes[i];
        let nodeCommunity = this.node2community[node];
        let weightedDegree = this.graph.getWeightedDegree(node);
        let neighbourCommunities = this.getNeighbourCommunities(node);

        // Remove node from its current community
        this.remove(node, nodeCommunity, 0);

        let bestComm = nodeCommunity; // Default
        let bestGain = 0;

        let keys = Object.keys(neighbourCommunities);


        keys.forEach(key => {
          let increase = this.modularityGain(node, key, neighbourCommunities[key], weightedDegree);
          console.log('increase', increase);
          if (increase > bestGain) {
            bestGain = increase;
            bestComm = key;
          }
        });
        this.insert(node, bestComm, neighbourCommunities[bestComm]);
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
      let c = this.node2community[n];
      if (this.total[c] > 0) {
        q += ( (this.inner[c]/m2) - Math.pow(this.total[c]/m2, 2) );
      }
    });
    return q;
  }


  modularityGain(node, community, degreeNodeCommunity, weightedDegree) {
    // console.log('> ', node, community, degreeNodeCommunity, weightedDegree, this.total);

    let totc = this.total[community];
    let degc = weightedDegree;
    let m2   = this.graph.total_weight;
    let dnc  = degreeNodeCommunity;

    // console.log('>> ', totc, degc, m2, dnc);
    return (dnc - totc*degc/m2);
  }

  printStats() {
    console.log('Community');
    Object.keys(this.node2community).sort().forEach( n => {
      let c = this.node2community[n];
      console.log('\tnode='+ n, ' community=' + c, ' total=' + this.total[c], ' inner='+this.inner[c] );
    });
    console.log('\tmodularity', this.modularity());
    console.log('\tmodularity 2', this.modularity2());
  }


}
