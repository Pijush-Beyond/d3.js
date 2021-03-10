const {
  select,
  csv,
  scaleLinear,
  scaleTime,
  extent,
  axisLeft,
  axisBottom,
  line,
  curveBasis,
  mean,
  format,
} = d3;

const svg = select('svg#visualization');
// console.log(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
if (!svg.attr('width')) svg.attr('width', Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
if (!svg.attr('height')) svg.attr('height', Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 80)
const width = +svg.attr('width');
const height = +svg.attr('height');
// var data;
// console.log(width, height)

const render = (data, yAxisLabel) => {
  // const title = 'Grosery Store Survery';

  svg.selectAll("*").remove();

  const xAxisLabel = 'Age';
  const xValue = d => d[xAxisLabel];

  const yValueF = d => d[yAxisLabel].Female;
  const yValueM = d => d[yAxisLabel].Male;

  const margin = { top: 10, right: 40, bottom: 88, left: 105 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

  const yMinMax = extent([...extent(data, d => d[yAxisLabel].Female), ...extent(data, d => d[yAxisLabel].Male)]);
  
  const yScale = scaleLinear()
    .domain(yMinMax)
    .range([innerHeight,0])
    .nice();

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxis = axisBottom(xScale).ticks(50)
    .tickSize(-innerHeight)
    .tickPadding(15);

  const yAxis = axisLeft(yScale).ticks(25).tickFormat(format('.3s'))
    .tickSize(-innerWidth)
    .tickPadding(10);

  const yAxisG = g.append('g').call(yAxis);
  yAxisG.selectAll('.domain').remove();

  yAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', -60)
    .attr('x', -innerHeight / 2)
    .attr('fill', 'black')
    .attr('transform', `rotate(-90)`)
    .attr('text-anchor', 'middle')
    .text(yAxisLabel);

  const xAxisG = g.append('g').call(xAxis)
    .attr('transform', `translate(0,${innerHeight})`);

  xAxisG.select('.domain').remove();

  xAxisG.append('text')
    .attr('class', 'axis-label')
    .attr('y', 70)
    .attr('x', innerWidth / 2)
    .attr('fill', 'black')
    .text(xAxisLabel);
  
  const lineGeneratorF = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValueF(d)))
    .curve(curveBasis);
  
  const lineGeneratorM = line()
    .x(d => xScale(xValue(d)))
    .y(d => yScale(yValueM(d)))
    .curve(curveBasis);

  g.append('path')
    .attr('class', 'line-path-F')
    .attr('d', lineGeneratorF(data));
  
  g.append('path')
    .attr('class', 'line-path-M')
    .attr('d', lineGeneratorM(data));

  // g.append('text')
  //   .attr('class', 'title')
  //   .attr('y', -10)
  //   .text(title);
};

const usedData = [];
csv('a1-grocerystoresurvey.csv')
  .then(data => {
    usedData.columns = ['Age','Income'];
    data.map(d => {
      for(let row of usedData){
        if (row.Age === +d.Age) {
          if (d.Gender === 'Female') {
            row.Income.Female.push(+d.Income);
            row.PurchaseAmount.Female.push(+d.PurchaseAmount);
          }
          else {
            row.Income.Male.push(+d.Income);
            row.PurchaseAmount.Male.push(+d.PurchaseAmount);
          }
          return;
        }
      }
      usedData.push({
        Age: +d.Age,
        Income: {
          "Female": [d.Gender === 'Female' ? + d.Income : 0],
          "Male": [d.Gender !== 'Male' ? + d.Income : 0]
        },
        PurchaseAmount: {
          "Female": [d.Gender === 'Female' ? + d.PurchaseAmount : 0],
          "Male": [d.Gender !== 'Male' ? + d.PurchaseAmount : 0]
        }
      })
    });
    usedData.sort((a, b) => a.Age - b.Age);
    usedData.forEach(d => {
      d.Income.Female = Math.round(mean(d.Income.Female));
      d.Income.Male = Math.round(mean(d.Income.Male));
      d.PurchaseAmount.Female = Math.round(mean(d.PurchaseAmount.Female));
      d.PurchaseAmount.Male = Math.round(mean(d.PurchaseAmount.Male));
    });
    render(usedData, 'Income');
  });
const selectOption = y => {
  if(y === 'Income')render(usedData, 'Income');
  else render(usedData, 'PurchaseAmount');
};