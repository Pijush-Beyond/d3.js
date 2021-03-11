const visualization = () => {
  const { scaleBand, scaleLinear, axisLeft, axisBottom, extent } = d3;

  const topTitleWidth = 20;
  const bottomTitleWidth =  15;
  const titleWidth =  10;

  const rulerWidthLeft =  50;
  const rulerWidthRight =  10;
  const rulerWidthTop =  10;
  const rulerWidthBottom =  20;

  const margin = {
    top: topTitleWidth + rulerWidthTop,
    right: titleWidth + rulerWidthRight,
    bottom: bottomTitleWidth + rulerWidthBottom,
    left: titleWidth + rulerWidthLeft,
    innertop: 5,
    innerright: 5,
    innerbottom: 5,
    innerleft: 5,
  };
  
  const xAxis = scaleBand()
    .domain(data.colmuns.slice(1))
    .range([0, width - margin.left - margin.right])
    .paddingInner(0.08)
    .paddingOuter(0.08)
  
  const yAxis = scaleBand()
    .domain(data.map(d => d.Year))
    .range([height - margin.top - margin.bottom, 0])
    .paddingInner(0.4)
    .paddingOuter(0.08);
  
  const colorsLight = {};
  for(let i of data.colmuns.slice(1))
    colorsLight[i] = scaleLinear().domain(extent(data, d => d[i])).range([75, 20])
  
  const colorsHue = scaleBand().domain(data.colmuns.slice(1)).range([0,360])
  
  svg.append('g')
    .attr('id', 'y-scale')
    .attr('transform', `translate(${margin.left},${margin.top})`)
    .call(axisLeft(yAxis).tickSize(0));
  
  svg.append('g')
    .attr('id', 'x-scale')
    .attr('transform', `translate(${margin.left},${height - margin.bottom})`)
    .call(axisBottom(xAxis).tickSize(0));
  
  svg.append('g')
    .attr('id', 'body')
    .selectAll('g')
    .data(data.colmuns.slice(1))
    .enter()
    .append('g')
    .attr('class', 'row')
    .attr('transform', d => `translate(${margin.left + xAxis(d)},${margin.top})`)
    .selectAll('rect')
    .data(d => data.map(value=> ({ Year:value.Year, value: value[d], column: d})))
    .enter()
    .append('rect')
    .attr('width', xAxis.bandwidth())
    .attr('height', yAxis.bandwidth())
    .attr('y', d => yAxis(d.Year))
    .attr('fill', d => `hsl(${colorsHue(d.column)},50%,${colorsLight[d.column](d.value)}%)`)
    .append('title')
    .text(d => `Year: ${d.Year}, Film Count: ${d.value}, Topic: ${d.column}`)
}