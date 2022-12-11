const game_order = ['2014_champion.csv','2015_msi.csv', '2015_champion.csv', '2016_msi.csv', '2016_champion.csv', '2017_msi.csv',
                '2017_champion.csv', '2018_msi.csv','2018_champion.csv', '2019_msi.csv', '2019_champion.csv', '2020_msi.csv',
                '2020_champion.csv', '2021_msi.csv', '2021_champion.csv', '2022_msi.csv', '2022_champion.csv',  ];
const hero_option = ["Total", "Picks", "Bans"];
const MARGIN_hero = { LEFT: 50, RIGHT: 50, TOP: 50, BOTTOM: 50 }
const WIDTH_hero = 1200 - (MARGIN_hero.LEFT + MARGIN_hero.RIGHT);
const HEIGHT_hero = 3360 - (MARGIN_hero.TOP + MARGIN_hero.BOTTOM);
let hero_attr = 'Total';

// build <select> options 
d3.select("#hero-area").selectAll("select").selectAll("option")
    .data(hero_option)
    .enter()
    .append("option")
    .text(d=>d)
    .attr('value', d=>d);
d3.select("#hero-select")
    .on('change', d=>{
      d3.select("#hero-area").selectAll('svg').remove();
        left_attr = d3.select("#left-select").property("value");   
    //   [left_bar_fill_g, left_bar_x, left_bar_y, left_bar_histogram] = drawBarChart("#left-bar", players, players, left_attr, left_attr, 'left');    
        drawRaceChart();
    }); 


function drawRaceChart() {
    let svg = d3.select("#hero-area")
                .append("svg")
                .attr("id", "hero")
                .attr("width", WIDTH_hero + MARGIN_hero.LEFT + MARGIN_hero.RIGHT)
                .attr("height", HEIGHT_hero + MARGIN_hero.TOP + MARGIN_hero.BOTTOM);
    
    let g = svg.append("g")
                .attr("transform", `translate(${MARGIN_hero.LEFT}, ${MARGIN_hero.TOP})`)
    
    ori_data = {"Champion": "Alistar", "Picks": 5, "Bans": 73, "Total": 78}

    let Xdatas = ori_data.map(function(d) {return d[hero_attr]}),
        Ydatas = ori_data.map(function(d) {return d.Champion});

    let x = d3.scaleLinear().domain([0, 0]).rangeRound([0, WIDTH_hero]);
    let y = d3.scaleBand().domain([]).rangeRound([HEIGHT_hero, 0]);

    let title = g.append('text')
        .attr('transform', 'translate(' + (WIDTH_hero/2 - MARGIN_hero.LEFT) + ',0)')
        .attr('font-weight', 600)
        .text('Default');

    let y_axis = g.append('g')
        .call(d3.axisLeft(y));

    let chart = g.selectAll('rect')
        .data(ori_data)
        .enter()
        .append('g');
    
    // 矩形
    let chart_rect = chart.append('rect')
        .attr('x', function(d) {
            return x(x.domain()[0]) + 5;
        })
        .attr('cursor', 'pointer')
        .attr('y', function(d) {
            return y(d.Champion);
        })
        .attr('fill',(d,i) => d3.schemeTableau10[i%10])
        .attr('stroke', '#FFF')
        .attr('stroke-width', '2px')
        .transition()
        .duration(1000).ease(d3.easeBounceIn)
        .attr('width', function(d) {
            return x(d[hero_attr]);
        })
        .attr('height', y.bandwidth());
    // 矩形文字
    let chart_text = chart.append('text').attr('fill', '#000')
        .attr('y', function(d) {
            return y(d.Champion)+13;
        })
        .attr('x', function(d) {
            return x(x.domain()[0]);
        })
        .transition()
        .duration(1000).ease(d3.easeBounceIn)
        .attr('dx', function(d) {
            return x(d[hero_attr])+5;
        }).attr('dy', 0)
        .text(function(d) {return d[hero_attr]});
    
    game_order.forEach(game_name => {
        d3.csv(`data/hero_usage_data/${game_name}`, d3.autoType).then(data => {
            data.sort(function(x, y){
                if(x[hero_attr] == y[hero_attr])
                    return d3.ascending(x.Champion, y.Champion);
                else
                    return d3.ascending(x[hero_attr], y[hero_attr]);
            })
            Xdatas = data.map(function(d) {return d[hero_attr]});
            Ydatas = data.map(function(d) {return d.Champion});
        
            x = d3.scaleLinear().domain([d3.min(Xdatas), d3.max(Xdatas)]).rangeRound([0, WIDTH_hero]);
            y = d3.scaleBand().domain(Ydatas).rangeRound([HEIGHT_hero, 0]);
        
            // title
            title.transition()
            .duration(1000).ease(d3.easeBounceIn)
            .text(game_name);

            // y axis
            y_axis.transition()
            .duration(1000).ease(d3.easeBounceIn)
            .call(d3.axisLeft(y));
        
            chart = g.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('g');
                    
            // 矩形
            chart.append('rect')
                .attr('x', function(d) {
                    return x(x.domain()[0]) + 5;
                })
                .attr('cursor', 'pointer')
                .attr('y', function(d) {
                    return y(d.Champion);
                })
                .attr('fill',(d,i) => d3.schemeTableau10[i%10])
                .attr('stroke', '#FFF')
                .attr('stroke-width', '2px')
                .transition()
                .duration(1000).ease(d3.easeBounceIn)
                .attr('width', function(d) {
                    return x(d[hero_attr]);
                })
                .attr('height', y.bandwidth());
            // 矩形文字
            chart.append('text').attr('fill', '#000')
                .attr('y', function(d) {
                    return y(d.Champion)+13;
                })
                .attr('x', function(d) {
                    return x(x.domain()[0]);
                })
                .transition()
                .duration(1000).ease(d3.easeBounceIn)
                .attr('dx', function(d) {
                    return x(d[hero_attr])+5;
                }).attr('dy', 0)
                .text(function(d) {return d[hero_attr]});
        })
    });

}
