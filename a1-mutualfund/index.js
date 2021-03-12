// const { pack } = d3;

var data = {};
const { csv, select, max } = d3;

const svg = select('svg.bubble');
if (!svg.attr('width')) svg.attr('width', Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 50)
if (!svg.attr('height')) svg.attr('height', Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 60)
const width = +svg.attr('width') - 100;
const height = +svg.attr('height');
svg.attr("class", "bubble");

const visualization = (dataset, value) => {
  console.log(value);
  svg.selectAll('*').remove();
  const color = d3.scaleLinear().domain(d3.extent(dataset["children"], d => d[value])).range([70, 20]);

  const bubble = d3.pack(dataset)
    .size([width, width])
    .padding(1.5);

  var nodes = d3.hierarchy(dataset)
    .sum(function (d) { return d[value]; });

  var node = svg.selectAll(".node")
    .data(bubble(nodes).descendants())
    .enter()
    .filter(function (d) {
      return !d.children
    })
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });

  node.append("title")
    .text(function (d,i) {
      return d.data.Name + " : " + d3.format(',.3f')(d.data[value]).replace(/\.0*/g, '');
    });

  node.append("circle")
    .attr("r", function (d) {
      return d.r;
    })
    .style("fill", function (d) {
      return `hsl(0,44%,${color(d.data[value])}%)`;
    });

  node.append("text")
    .attr("dy", ".2em")
    .style("text-anchor", "middle")
    .text(function (d) {
      // console.log(d.data.Name.substring(0, d.r / 3),d.r)
      return d.data.Name.substring().replace(/(\S)(\S*\s*)(\s)/gm, '$1.$3');
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", function (d) {
      return d.r / 4;
    })
    .attr("fill", "white");

  node.append("text")
    .attr("dy", "1.3em")
    .style("text-anchor", "middle")
    .text(function (d) {
      return d3.format('.5s')(d.data[value]).replace(/G/g, 'B');
    })
    .attr("font-family", "Gill Sans", "Gill Sans MT")
    .attr("font-size", function (d) {
      return d.r / 5;
    });

}

d3.csv('a1-mutualfunds.csv', rendereddata => {
  data["children"] = rendereddata;
  // console.log(data.columns)
  data["children"].forEach(d => {
    // d['Name'] = +d['Name'] || 0;
    // d['Symbol']:,
    d['YTD'] = +d['YTD'] || 0;
    d['3MO'] = +d['3MO'] || 0;
    d['1YR'] = +d['1YR'] || 0;
    d['3YR'] = +d['3YR'] || 0;
    d['5YR'] = +d['5YR'] || 0;
    d['10YR'] = +d['10YR'] || 0;
    d['Yield'] = +d['Yield'] || 0;
    d['Rating'] = d['rating'] ? d['rating'].length : 0;
    // d['Expense'] = +d['Expense'] || 0;
    d['Expense ratio'] = +d['Expense ratio'] || 0;
    d["Mgr tenure"] = +d["Mgr tenure"] || 0;
    d['Net assets'] = +d['Net assets'].replace(/,/g, '') || 0;
    // d['Category']:'
    d["Count"] = d['Net assets'];
  });
  const option = select('select#select')
  Object.entries(data['children'][0]).map(v => {
    if (!isNaN(v[1])) option.append('option').attr('value', v[0]).text(v[0]);
  })
  select('u#title').text(`Bubble Graph about Mutual Fund's ${option.select("option").attr("value")}`)
  visualization(data, option.select("option").attr("value"));
})

const selectOption = value => {
  visualization(data, value);
  select('u#title').text(`Bubble Graph about Mutual Fund's ${value}`)
}