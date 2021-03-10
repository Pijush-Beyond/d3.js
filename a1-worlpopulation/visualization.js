const visualize = (data, xAxis, yAxis) => {
  svg.selectAll('*').remove();
  const { scaleLinear, scaleBand, extent, axisBottom, axisLeft, format } = d3;

  const topTitleWidth = useDefineTopTitleWidth ||  20;
  const bottomTitleWidth = useDefineBottomTitleWidth || 15;
  const titleWidth = useDefineOtherTitleWidth || 10;

  const rulerWidthLeft = useDefineRulerWidthLeft || 10;
  const rulerWidthRight = useDefineRulerWidthRight || 10;
  const rulerWidthTop = useDefineRulerWidthTop || 10;
  const rulerWidthBottom = useDefineRulerWidthBottom || 20;
  
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

  const xMinMax = extent(data, d => d[xAxis]);

  // for left
  {
    const y = scaleBand().
      domain(data.map(value => value[yAxis]))
      .range([0, height - margin.top - margin.bottom])
      .paddingInner(0.01)
      .paddingOuter(0.1);

    const bottomRuler = svg.append('g')
      .attr('id', 'left-ruler')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    bottomRuler.call(axisLeft(y).tickSize(-(width - margin.left - margin.right)))
      .selectAll('path.domain').remove();
  }

  // for bottom
  {
    const x = scaleLinear()
      .domain(xMinMax)
      .range([0, width - margin.right - margin.left - margin.innerright - margin.innerleft]);

    const bottomRuler = svg.append('g')
      .attr('id', 'bottom-ruler')
      .attr('transform', `translate(${margin.left},${height - margin.bottom})`);
    bottomRuler.call(axisBottom(x).tickFormat(format('.3s')).tickSize(-(height - margin.top - margin.bottom)))
      .selectAll('path.domain').remove();
  }

  // body
  {
    const x = scaleLinear().domain([0,xMinMax[1]]).range([0, width - margin.right - margin.left - margin.innerright - margin.innerleft]);
    const y = scaleBand().
      domain(data.map(value => value[yAxis]))
      .range([0, height - margin.top - margin.bottom ])
      .paddingInner(0.01)
      .paddingOuter(0.1);
    const body = svg.append('g')
      .attr('id', 'body')
      .attr('transform', `translate(${margin.left+margin.innerleft},${margin.top})`);
    body.selectAll('rect')
      .data(data)
      .enter().append('rect')
      .attr('width', data => x(data[xAxis]))
      .attr('height', data => y.bandwidth())
      .attr('y', data => y(data[yAxis]))
      .attr('fill', 'steelblue');
    svg.append('rect')
      .attr('id','body-box')
      .attr('width',width - margin.left - margin.right)
      .attr('height', height - margin.top - margin.bottom)
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }
  
  // for top  
  {

  }

  // for right
  {

  }
  
}