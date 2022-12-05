const data_legend = [
  {
    "name": "pts",
    "color": "red",
  },
  {
    "name": "reb",
    "color": "green",
  },
  {
    "name": "ast",
    "color": "blue",
  }
  ,
  {
    "name": "r:avg",
    "color": "white",
  }
];
let left_bar_fill_g, left_bar_x, left_bar_y, left_bar_histogram;
let center_bar_fill_g, center_bar_x, center_bar_y, center_bar_histogram;
let right_bar_fill_g, right_bar_x, right_bar_y, right_bar_histogram;
let [left_attr, center_attr, right_attr] = [null, null, null];
[left_attr, center_attr, right_attr] = ["reb",  "ast", "pts"];

let isBrushedBar = false;
let isBrushedScatter = false;
const MARGIN_scatter = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH_scatter = 600 - MARGIN_scatter.LEFT - MARGIN_scatter.RIGHT;
const HEIGHT_scatter = 600 - MARGIN_scatter.TOP - MARGIN_scatter.BOTTOM;

const MARGIN_bar = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 50 }
const WIDTH_bar = 400 - (MARGIN_bar.LEFT + MARGIN_bar.RIGHT)
const HEIGHT_bar = 300 - (MARGIN_bar.TOP + MARGIN_bar.BOTTOM)
const FHeight_bar = 300;
const fontSize_bar = 16;

const MARGIN_map = { LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10 };
const FWidth_map = 1500, FHeight_map = 500;
const FLeftTopX_map = 10, FLeftTopY_map = 10;
const projection = d3.geoEquirectangular()
                    //  .scale(200);
d3.csv("D3_HW1_data/NBA1516.csv", d3.autoType).then(players => {
  d3.csv("D3_HW1_data/TeamLoc.csv").then(teams => {
    d3.json("data/map.json").then(map => {
      players.forEach(element => {
        if (element.draft_number == "Undrafted")
          element.draft_number = 65;
      });
      
      // ------------------------ map -----------------------------
      // #region 
      const svg_map = d3.select("#map-area").append("svg")
              .attr("width", FWidth_map)
              .attr("height", FHeight_map);    
      let g_map = svg_map.append("g")
              .attr("transform", `translate(${FLeftTopX_map + MARGIN_map.LEFT}, 
                                            ${FLeftTopY_map + MARGIN_map.TOP})`);
      g_map.selectAll("path")
        .data(map.features)
        .enter()
        .append("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", "#fff")
        .style("stroke", "#000");
        // console.log(d["properties"]["postal"])
      let team_player_num = getTeamPlayersNum(teams, players);
      // console.log(team_player_num)
      let team_dots = svg_map.selectAll("g").data(teams).enter().append("g")
                              .attr("transform", (d, i) => {
                                var po = projection([d.lon, d.lat]);
                                return `translate(${FLeftTopX_map + MARGIN_map.LEFT + po[0]}, ${FLeftTopY_map + MARGIN_map.TOP + po[1]})`;
                              })
                 
      const fontSize_map = 20;
      team_dots.append("circle")
        .attr('r', d => team_player_num[d.team_abbreviation])
        .attr("fill", 'red')
        .attr("opacity", "0.5");
      team_dots.append("text")
        .attr("x", 12)
        .attr("y", 3)
        .attr("font-size", fontSize_map)
        .text(d => d.team_abbreviation); 
      // #endregion 
      // ------------- bar charts --------------------------

      [left_bar_fill_g, left_bar_x, left_bar_y, left_bar_histogram] = drawBarChart("#left-bar", players, players, left_attr, left_attr, 40);
      [center_bar_fill_g, center_bar_x, center_bar_y, center_bar_histogram] = drawBarChart("#center-bar", players, players, center_attr, center_attr, 30);
      [right_bar_fill_g, right_bar_x, right_bar_y, right_bar_histogram] = drawBarChart("#right-bar", players, players, right_attr, right_attr, 20);

      // #region
      // console.log(pts_fill_g)
      // ----- Left Bar Chart -----
      let brush_left = d3.brushX()
                      .extent([[0, 0], [WIDTH_bar, HEIGHT_bar]])
                      .on('start brush', brushed_left)
                      .on('end', endBrushed_left)
      let left_selected = left_bar_x.domain();
      left_bar_fill_g.append('g')
                .attr('class', 'brush-bar')
                .call(brush_left)
      // ----- Center Bar Chart -----
      let brush_center = d3.brushX()
                      .extent([[0, 0], [WIDTH_bar, HEIGHT_bar]])
                      .on('start brush', brushed_center)
                      .on('end', endBrushed_center)
      let center_selected = center_bar_x.domain();
      center_bar_fill_g.append('g')
                .attr('class', 'brush-bar')
                .call(brush_center)
      // ----- Right Bar Chart -----
      let brush_right = d3.brushX()
                      .extent([[0, 0], [WIDTH_bar, HEIGHT_bar]])
                      .on('start brush', brushed_right)
                      .on('end', endBrushed_right)
      let right_selected = right_bar_x.domain();
      right_bar_fill_g.append('g')
                .attr('class', 'brush-bar')
                .call(brush_right)
      // #endregion
      // ------------- functions for views -----------------
      
      function transitionSelection (selected_players, isBar) {
        let team_player_num = getTeamPlayersNum(teams, selected_players);
        team_dots.selectAll("circle")
                  .transition()
                  .duration(1000)
                  .attr('r', d => team_player_num[d.team_abbreviation]);
        // console.log(pts_fill_g)
        reRenderingBarChart(left_bar_fill_g, selected_players, left_bar_x, left_bar_y, left_bar_histogram);
        reRenderingBarChart(center_bar_fill_g, selected_players, center_bar_x, center_bar_y, center_bar_histogram);
        reRenderingBarChart(right_bar_fill_g, selected_players, right_bar_x, right_bar_y, right_bar_histogram);
        if (isBar) {
          dots.transition()
              .duration(1000)
              .attr('stroke-width', d => {
                let isSelected = false;
                selected_players.forEach(player=>{
                  if (d==player) {
                    isSelected = true;
                  }
                })
                if (isSelected)
                  return '0.5px';
                else
                  return '0';
              })
              .attr("fill-opacity", d => {
                let isSelected = false;
                selected_players.forEach(player=>{
                  if (d==player) {
                    isSelected = true;
                  }
                })
                if (isSelected)
                  return '1';
                else
                  return '0.4';
              })
        }
      } // transitionSelection
      function filter_bar_selected() {
        let selected_players = []
        players.forEach(player=>{
          // filter bar chart selection
          if ((player[left_attr] >= left_selected[0] && player[left_attr] <= left_selected[1]) &&
              (player[center_attr] >= center_selected[0] && player[center_attr] <= center_selected[1]) &&
              (player[right_attr] >= right_selected[0] && player[right_attr] <= right_selected[1]) 
             )
            selected_players.push(player);
        })
        return selected_players;
      }
      // ------------- brush for bar charts -------------------
      //#region 
      function brushed_left() {
        if (d3.event.selection==null) return;
        var extent = d3.event.selection;//console.log(extent, d3.event.selection);
        let reverse_x = d3.scaleLinear()
                      .domain(left_bar_x.range())
                      .range(left_bar_x.domain())
        // console.log(reverse_x(extent[0]), reverse_x(extent[1]));
        
        left_selected = [reverse_x(extent[0]), reverse_x(extent[1])];
      } // brushed_left
      function endBrushed_left() {
        if (isBrushedScatter) {
          isBrushedScatter = false;
          d3.select('.brush')
            .call(brush.clear)
        }
        if (d3.event.selection==null) {
          left_selected = left_bar_x.domain();
        }
        else {
          isBrushedBar = true;
        }
        let selected_players = filter_bar_selected();
        transitionSelection(selected_players, true);
      } // endBrushed_left
      function brushed_center() {
        if (d3.event.selection==null) return;
        var extent = d3.event.selection;
        let reverse_x = d3.scaleLinear()
                      .domain(center_bar_x.range())
                      .range(center_bar_x.domain())
        
        center_selected = [reverse_x(extent[0]), reverse_x(extent[1])];
      } // brushed_center
      function endBrushed_center() {
        if (isBrushedScatter) {
          isBrushedScatter = false;
          d3.select('.brush')
            .call(brush.clear)
        }
        if (d3.event.selection==null) {
          center_selected = center_bar_x.domain();
        } else {
          isBrushedBar = true;
        }
        let selected_players = filter_bar_selected();
        transitionSelection(selected_players, true);
      } // endBrushed_center
      function brushed_right() {
        if (d3.event.selection==null) return;
        var extent = d3.event.selection;
        let reverse_x = d3.scaleLinear()
                      .domain(right_bar_x.range())
                      .range(right_bar_x.domain())
        right_selected = [reverse_x(extent[0]), reverse_x(extent[1])];
      } // brushed_right
      function endBrushed_right() {
        if (isBrushedScatter) {
          isBrushedScatter = false;
          d3.select('.brush')
            .call(brush.clear)
        }
        if (d3.event.selection==null) right_selected = right_bar_x.domain();
        else {
          isBrushedBar = true;
        }
        let selected_players = filter_bar_selected();
        transitionSelection(selected_players, true);
      } // endBrushed_right
      //#endregion
    }) // us-states.json
  }) // TeamLoc.csv
}) // NBA1516.csv



function reRenderingBarChart(selected_g, selected_players, x, y, histogram) {

  fill_bins = histogram(selected_players);
  // console.log(fill_bins);
  selected_g.selectAll("rect")
          .data(fill_bins)
          .transition()
          .duration(1000)
          .attr("y", d => (HEIGHT_bar - y(d.length))) 
          // .attr("transform", d => `translate(${pts_x(d.x0)}, 0)`) 
          .attr("height", d => y(d.length))
  // console.log(selected_g)
} // reRenderingBarChart

function getTeamPlayersNum(teams, players) {
  let team_player_num = {};
  teams.forEach(element => {
    team_player_num[element.team_abbreviation] = 0;
  });
  players.forEach(element => {
    team_player_num[element.team_abbreviation] += 1;
  });
  return team_player_num;
} // getTeamPlayersNum
function drawBarChart(selected_div, all_players, selected_players, attribute, title, tick_nums) {
  
  
  let svg = d3.select(selected_div).append("svg")
              .attr("width", WIDTH_bar + MARGIN_bar.LEFT + MARGIN_bar.RIGHT)
              .attr("height", HEIGHT_bar + MARGIN_bar.TOP + MARGIN_bar.BOTTOM)
  let g = svg.append("g")
              .attr("transform", `translate(${MARGIN_bar.LEFT}, ${MARGIN_bar.TOP})`)
  // X ticks
  const x = d3.scaleLinear()
      .domain([d3.min(all_players, d => d[attribute]), d3.max(all_players, d => d[attribute])])
      .range([0, WIDTH_bar])

  g.append("g")
    .attr("transform", `translate(0, ${HEIGHT_bar})`)
    .call(d3.axisBottom(x));

  let histogram = d3.histogram()
                        .value(d => d[attribute])
                        .domain(x.domain())
  
  if (tick_nums != undefined) histogram.thresholds(x.ticks(tick_nums));
  const bins = histogram(all_players);
  // console.log(bins);
  // Y ticks
  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length)])
    .range([0, HEIGHT_bar])
    
  g.append("g")
    .call(d3.axisLeft(y))   
  g.selectAll("rect")
    .data(bins)
    .enter().append("rect")
    .attr("x", d => x(d.x0))
    .attr("y", d => (HEIGHT_bar-y(d.length)))
    .attr("width", d => x(d.x1)-x(d.x0))
    .attr("height", d => y(d.length))
      .style("fill",  `rgba(0, 0, 0, 0)`)
      .attr('stroke', 'black')
      .attr('stroke-width', "0.5px")
  svg.append("text")
    .attr("transform", `translate(${MARGIN_bar.LEFT+ 10}, ${MARGIN_bar.TOP})`)
    .attr("font-size", fontSize_bar)
    .text(title) 
  let fill_g = svg.append("g")
    .attr("transform", `translate(${MARGIN_bar.LEFT}, ${MARGIN_bar.TOP})`)
  const fill_bins = histogram(selected_players);
  // console.log(fill_bins)
  // console.log(fill_bins);
  fill_g.selectAll("rect")
    .data(fill_bins)
    .enter()
    .append("rect")
      // .attr('class', `${title}-bin`)
      .attr("x", d => x(d.x0))
      .attr("y", d => (HEIGHT_bar-y(d.length)))
      .attr("width", d => x(d.x1)-x(d.x0))
      .attr("height", d => y(d.length))
      .style("fill", "rgba(105, 179, 162, 16)")
    // console.log(fill_g)
  return [fill_g, x, y, histogram];
} // drawBarChart