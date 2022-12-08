// select the attribute show in bar chart
const bar_chart_attribute_option = ["empty", "FB%", "KDA", "GPM", "KP%", "DMG%", "DPM", "VSPM"];
let left_selected, center_selected, right_selected;
// TODO
let left_bar_fill_g, left_bar_x, left_bar_y, left_bar_histogram;
let center_bar_fill_g, center_bar_x, center_bar_y, center_bar_histogram;
let right_bar_fill_g, right_bar_x, right_bar_y, right_bar_histogram;
let [left_attr, center_attr, right_attr] = ["empty", "empty", "empty"];

const fixed_bins_nums = {"VSPM": 22, "DMG%": 25};
const fixed_x_axis_domain = {"KDA": [0, 9], "GPM": [200, 500], "DPM": [100, 700], "FB%": [0, 1.1], "KP%": [0.3, 1.1], "DMG%": [0.05, 0.375], "VSPM": [0.5,3.5]}
// bar chart variables
const MARGIN_bar = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 50 }
const WIDTH_bar = 400 - (MARGIN_bar.LEFT + MARGIN_bar.RIGHT)
const HEIGHT_bar = 300 - (MARGIN_bar.TOP + MARGIN_bar.BOTTOM)
const FHeight_bar = 300;
const fontSize_bar = 16;

// hw2 scatter variables(not use)
let isBrushedBar = false;
let isBrushedScatter = false;
const MARGIN_scatter = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH_scatter = 600 - MARGIN_scatter.LEFT - MARGIN_scatter.RIGHT;
const HEIGHT_scatter = 600 - MARGIN_scatter.TOP - MARGIN_scatter.BOTTOM;

// LoL map variables
const MARGIN_lol = { LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10 };
const FWidth_lol = 500, FHeight_lol = 500;
const FLeftTopX_lol = 10, FLeftTopY_lol = 10;
const fontSize_lol = 16;
const WIDTH_lol = FWidth_lol - MARGIN_lol.LEFT - MARGIN_lol.RIGHT;
const HEIGHT_lol = FHeight_lol - MARGIN_lol.TOP - MARGIN_lol.BOTTOM;

// map variables
const MARGIN_map = { LEFT: 10, RIGHT: 10, TOP: 10, BOTTOM: 10 };
const FWidth_map = 1500, FHeight_map = 500;
const FLeftTopX_map = 10, FLeftTopY_map = 10;
const projection = d3.geoEquirectangular();
const fontSize_map = 16;

// build <select> options 
d3.selectAll("select").selectAll("option")
  .data(bar_chart_attribute_option)
  .enter()
  .append("option")
  .text(d=>d)
  .attr('value', d=>d);


const role = [{"role":"TOP", "x":95,"y":85},
              {"role":"MID", "x":220,"y":245},
              {"role":"ADC", "x":400,"y":400},
              {"role":"SUPPORT", "x":330,"y":380},
              {"role":"JUNGLE", "x":120,"y":230}]

d3.csv("data/players.csv", d3.autoType).then(players => {
  d3.csv("data/country_loc.csv").then(countries => {
    d3.json("data/map.json").then(map => {
      players.forEach(element => {
        if (element.draft_number == "Undrafted")
          element.draft_number = 65;
      });
      const svg_lol = d3.select("#lol-area").append("svg")
                        .attr("width", FWidth_lol)
                        .attr("height", FHeight_lol);
      let img_lol = svg_lol.append("image")
                    .attr("xlink:href", 'data/lol_map.jpg')
                    .attr("width", WIDTH_lol)
                    .attr("height", HEIGHT_lol)
                    .attr("opacity", "0.95")
                    .attr("transform", `translate(${FLeftTopX_lol + MARGIN_lol.LEFT}, 
                      ${FLeftTopY_lol + MARGIN_lol.TOP})`);

      let role_dots = svg_lol.selectAll("g").data(role).enter().append("g")
                                .attr("transform", (d, i) => {
                                  return `translate(${FLeftTopX_map + MARGIN_map.LEFT + d.x}, ${FLeftTopY_map + MARGIN_map.TOP + d.y})`;
                                })
      let role_player_num = getRolePlayersNum(role, players);
      console.log(role_player_num)
      role_dots.append("circle")
                  .attr('r', d=> role_player_num[d.role])
                  .attr("fill", 'red')
                  .attr("opacity", "0.9");
      role_dots.append("text")
                  .attr("x", -20)
                  .attr("y", -20)
                  .attr("font-size", fontSize_lol)
                  .text(d => d.role)
                  .style("fill", "white")
                  .attr("opacity", 1); 
      // #region world map
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
        .style("stroke", "#a4aca7");
      
      let country_player_num = getCountryPlayersNum(countries, players);

      let country_dots = svg_map.selectAll("g").data(countries).enter().append("g")
                              .attr("transform", (d, i) => {
                                var po = projection([d.lon, d.lat]);
                                return `translate(${FLeftTopX_map + MARGIN_map.LEFT + po[0]}, ${FLeftTopY_map + MARGIN_map.TOP + po[1]})`;
                              })
      
      country_dots.append("circle")
        .attr('r', d => Math.sqrt(country_player_num[d.Country]*9))
        .attr("fill", '#1491a8')
        .attr("opacity", "0.7");
      country_dots.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("font-size", fontSize_map)
        .text(d => { return d.Country})
        .attr("opacity", 1); 
      // #endregion 
      // ------------- bar charts --------------------------
      
      d3.select("#left-select")
        .on('change', d=>{
          d3.select("#left-bar").selectAll('svg').remove();
          left_attr = d3.select("#left-select").property("value");   
          [left_bar_fill_g, left_bar_x, left_bar_y, left_bar_histogram] = drawBarChart("#left-bar", players, players, left_attr, left_attr, 'left');    
      });  
      d3.select("#center-select")
        .on('change', d=>{
          d3.select("#center-bar").selectAll('svg').remove();
          center_attr = d3.select("#center-select").property("value"); 
          [center_bar_fill_g, center_bar_x, center_bar_y, center_bar_histogram] = drawBarChart("#center-bar", players, players, center_attr, center_attr, 'center');      
      });  
      d3.select("#right-select")
        .on('change', d=>{
          d3.select("#right-bar").selectAll('svg').remove();
          right_attr = d3.select("#right-select").property("value"); 
          [right_bar_fill_g, right_bar_x, right_bar_y, right_bar_histogram] = drawBarChart("#right-bar", players, players, right_attr, right_attr, 'right');      
      });  
      [left_bar_fill_g, left_bar_x, left_bar_y, left_bar_histogram] = drawBarChart("#left-bar", players, players, left_attr, left_attr, 'left');
      [center_bar_fill_g, center_bar_x, center_bar_y, center_bar_histogram] = drawBarChart("#center-bar", players, players, center_attr, center_attr, 'center');
      [right_bar_fill_g, right_bar_x, right_bar_y, right_bar_histogram] = drawBarChart("#right-bar", players, players, right_attr, right_attr, 'right');

      function reRenderingBarChart(selected_g, selected_players, x, y, histogram) {

        fill_bins = histogram(selected_players);
        // console.log(fill_bins);
        selected_g.selectAll("rect")
                .data(fill_bins)
                .transition()
                .duration(1000)
                .attr("y", d => ( y(d.length))) 
                // .attr("transform", d => `translate(${pts_x(d.x0)}, 0)`) 
                .attr("height", d => HEIGHT_bar -y(d.length))
        // console.log(selected_g)
      } // reRenderingBarChart

      function getCountryPlayersNum(countries, players) {
        let country_player_num = {};
        countries.forEach(element => {
          country_player_num[element.Country] = 0;
        });
        // console.log(country_player_num);
        players.forEach(element => {
          country_player_num[element.Country] += 1;
        });
        return country_player_num;
      } // getTeamPlayersNum

      function getRolePlayersNum(roles, players) {
        let role_player_num = {};
        roles.forEach(element => {
          role_player_num[element.role] = 0;
        });
        // console.log(country_player_num);
        players.forEach(element => {
          role_player_num[element.Position] += 1;
        });
        return role_player_num;
      } // getRolePlayersNum
      function drawBarChart(selected_div, all_players, selected_players, attribute, title, side) {
        
        
        let svg = d3.select(selected_div).append("svg")
                    .attr("width", WIDTH_bar + MARGIN_bar.LEFT + MARGIN_bar.RIGHT)
                    .attr("height", HEIGHT_bar + MARGIN_bar.TOP + MARGIN_bar.BOTTOM)
        let g = svg.append("g")
                    .attr("transform", `translate(${MARGIN_bar.LEFT}, ${MARGIN_bar.TOP})`)
        let tick_nums = 20;
        if (attribute in fixed_bins_nums)
          tick_nums = fixed_bins_nums[attribute];
        
        let x_domain = [d3.min(all_players, d => d[attribute]), d3.max(all_players, d => d[attribute])];

        if (attribute in fixed_x_axis_domain) 
          x_domain = fixed_x_axis_domain[attribute];

        // X ticks
        const x = d3.scaleLinear()
            .domain(x_domain)
            .range([0, WIDTH_bar])
        

        x_g = g.append("g")
          .attr("transform", `translate(0, ${HEIGHT_bar})`)
          .call(d3.axisBottom(x));

        
        let histogram = d3.histogram()
                              .value(d => d[attribute])
                              .domain(x.domain())
                              .thresholds(x.ticks(tick_nums));
            
        const bins = histogram(all_players);
        // console.log(bins);
        // Y ticks
        const y = d3.scaleLinear()
          .domain([0, d3.max(bins, d => d.length)])
          .range([HEIGHT_bar, 0])
          
        g.append("g")
          .call(d3.axisLeft(y))   
        g.selectAll("rect")
          .data(bins)
          .enter().append("rect")
          .attr("x", d => x(d.x0))
          .attr("y", d => (y(d.length)))
          .attr("width", d => x(d.x1)-x(d.x0))
          .attr("height", d => HEIGHT_bar-y(d.length))
            .style("fill",  `rgba(255, 255, 255, 100)`)
            .attr('stroke', `rgba(0, 0, 0, 50)`)
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
            .attr("y", d => y(d.length))
            .attr("width", d => x(d.x1)-x(d.x0))
            .attr("height", d => HEIGHT_bar- y(d.length))
            .style("fill", "rgba(105, 179, 162, 16)")
            .attr('stroke', 'black')
            .attr('stroke-width', "0.5px")
          // console.log(fill_g)
        let brush = d3.brushX()
            .extent([[0, 0], [WIDTH_bar, HEIGHT_bar]])
            .on('start brush', d=>{brushed(side, x)})
            .on('end', d=>{endBrushed(side, x)})
        if (side == 'left')
          left_selected = x.domain();
        else if (side == 'center')
          center_selected = x.domain();
        else if (side == 'right')
          right_selected = x.domain();
        fill_g.append('g')
          .attr('class', 'brush-bar')
          .call(brush)
        return [fill_g, x, y, histogram];
      } // drawBarChart

      //#region brush for bar charts
      function brushed(side, x) {
        if (d3.event.selection==null) return;
        var extent = d3.event.selection;//console.log(extent, d3.event.selection);
        let reverse_x = d3.scaleLinear()
                      .domain(x.range())
                      .range(x.domain())
        // console.log(reverse_x(extent[0]), reverse_x(extent[1]));
        if (side=='left')
          left_selected = [reverse_x(extent[0]), reverse_x(extent[1])];
        else if (side == 'center')
          center_selected = [reverse_x(extent[0]), reverse_x(extent[1])];
        else if (side == 'right')
          right_selected = [reverse_x(extent[0]), reverse_x(extent[1])];
          console.log('left:', left_selected, 'center:', center_selected, 'right: ', right_selected);
      } // brushed
      function endBrushed(side, x) {
        if (isBrushedScatter) {
          isBrushedScatter = false;
          d3.select('.brush')
            .call(brush.clear)
        }
        if (d3.event.selection==null) {
          if (side == 'left')
            left_selected = x.domain();
          else if (side == 'center')
            center_selected = x.domain();
          else if (side == 'right')
            right_selected = x.domain();
          console.log('left:', left_selected, 'center:', center_selected, 'right: ', right_selected);
        }
        else {
          isBrushedBar = true;
        }
        let selected_players = filter_bar_selected();
        transitionSelection(selected_players, true);
      } // endBrushed

      //#endregion

            
      function transitionSelection (selected_players, isBar) {
        let role_selected_player_num = getRolePlayersNum(role, selected_players);
        role_dots.selectAll("circle")
                  .transition()
                  .duration(1000)
                  .attr('r', d => role_selected_player_num[d.role]);
        role_dots.selectAll("text")
                  .transition()
                  .duration(1000)
                  .attr("opacity", d => { 
                          if (role_selected_player_num[d.role] > 0) {
                            return 1; 
                          } else return 0;
                        }); 
        let country_selected_player_num = getCountryPlayersNum(countries, selected_players);
        country_dots.selectAll("circle")
                  .transition()
                  .duration(1000)
                  .attr('r', d => Math.sqrt(country_selected_player_num[d.Country]*9));
        country_dots.selectAll("text")
                  .transition()
                  .duration(1000)
                  .attr("opacity", d => { 
                          if (country_selected_player_num[d.Country] > 0) {
                            return 1; 
                          } else return 0;
                        }); 
        // console.log(pts_fill_g)
        reRenderingBarChart(left_bar_fill_g, selected_players, left_bar_x, left_bar_y, left_bar_histogram);
        reRenderingBarChart(center_bar_fill_g, selected_players, center_bar_x, center_bar_y, center_bar_histogram);
        reRenderingBarChart(right_bar_fill_g, selected_players, right_bar_x, right_bar_y, right_bar_histogram);
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

    }) // us-states.json
  }) // TeamLoc.csv
}) // NBA1516.csv

