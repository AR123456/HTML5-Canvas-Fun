// Node Link diagrams highlight the relationships that
//exist within a complex and connected system
//  are useful to show interactions
// show connection of different strengths by linking nodes
// can encode info about node using circle size  and forces
// color of circle can be used too

///////////// set up canvas
const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");
///////////make color scale ///////////
// const color = d3.scaleOrdinal(d3.schemeCategory20);
// change for v5 of d3
const color = d3.scaleOrdinal(d3.schemeDark2);

// Add "forces" to the simulation here
const simulation = d3
  .forceSimulation()
  // use center force to make sure nodes are balanced around center of canvas
  .force("center", d3.forceCenter(width / 2, height / 2))
  // use negative charge so nodes are nicley spread out from each other
  .force("charge", d3.forceManyBody().strength(-50))
  // use force collide to keep circles from overlaping
  // pass in radius but could use radius method
  .force("collide", d3.forceCollide(10).strength(0.9))
  // set up link forces
  .force(
    "link",
    // using optional id method to identify connection
    d3.forceLink().id((d) => {
      return d.id;
    })
  );

//v5 syntax
d3.json("data/force.json")
  .then((graph) => {
    // append links and nodes in the data loading function
    // data is split into nodes and links
    // this is the format the links method needs
    //need to add a line for every link that we want graph to show and
    //  a node for every character in our data
    console.log(graph);

    // Add lines for every link in the dataset
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      // pass array of links into data join
      .data(graph.links)
      .enter()
      // append line for each connection in dataset
      .append("line")
      // set stroke width according to the value of each connection
      // characters that occur together in more scenes will have thicker line
      .attr("stroke-width", (d) => {
        // using Math.sqrt so that non of the values are massivly thicker than others
        return Math.sqrt(d.value);
      });
    // Add circles for every node in the dataset
    const node = svg
      .append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      // using nodes array from data
      .data(graph.nodes)
      .enter()
      .append("circle")
      // each has radias of 5
      .attr("r", 5)
      .attr("fill", (d) => {
        // set fill based on the group they belong to
        return color(d.group);
      })
      .call(
        d3
          // drag allows for dragging within the canvas
          .drag()
          // event listeners for each stage of drag
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );
    // Basic tooltips
    // namd of characer with hover over node
    node.append("title").text((d) => {
      return d.id;
    });
    // Attach nodes to the simulation, add listener on the "tick" event
    // runs function that will update the vis on every tick of
    // force simulation
    simulation.nodes(graph.nodes).on("tick", ticked);
    // Associate the lines with the "link" force
    simulation.force("link").links(graph.links);
    // Dynamically update the position of the nodes/links as time passes
    // feed in array of associations between different nodes
    function ticked() {
      // updates the postion of circles and lines in chart
      // on every tick of sim force layout is adding different
      //positional attributes to both links and arrays
      // so have access to source and target field x and y values
      link
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });
      // circle x,y can use the x and y values the sim puts on for us
      node
        .attr("cx", (d) => {
          return d.x;
        })
        .attr("cy", (d) => {
          return d.y;
        });
    }
  })
  .catch(function (error) {
    console.log(error);
  });

// Change the value of alpha, so things move around when we drag a node
function dragstarted(d) {
  // reheats the simulation whenever a node gets dragged
  // all nodes will keep changing position to react with
  // position of mouse
  if (!d3.event.active)
    simulation
      // the alpha represents how tempered all the forces should be
      // initially graph starts off with alpha 1  and decreases
      // to 0 over time.  set alpha to 7 means on restart
      // sim will only decay to 0.7 as a min and thus continue
      // to be repositioned as we move around
      .alphaTarget(0.7)
      .restart();
  // set force x and foce y of the node to its current
  // position so it dosent immediatly fly away
  d.fx = d.x;
  d.fy = d.y;
}

// Fix the position of the node that we are looking at
function dragged(d) {
  // every time we move node it gets a different postion and
  // the node gets pulled up to match the position of the cursor
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

// Let the node do what it wants again once we've looked at it
function dragended(d) {
  if (!d3.event.active)
    simulation
      // set alpha target back to 0 if we are not draging
      .alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
