const { csv, select, max } = d3;

const svg = select('svg#visualization');
if (svg.attr('width')) svg.attr('width', Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
if (svg.attr('height')) svg.attr('height', Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 120)
const width = +svg.attr('width');
const height = +svg.attr('height');
var count = 15;
const minCount = 15;
var maxCount = 50;
var startCount = 0;
var reversed = true;
var checking = false;
var totalCount;
var data;
var maxPopulation;
csv('https://gist.githubusercontent.com/curran/0ac4077c7fc6390f5dd33bf5c06cb5ff/raw/605c54080c7a93a417a3cea93fd52e7550e76500/UN_Population_2019.csv')
  .then(loadedData => {
    data = loadedData;
    data.forEach(dataRow => {
      for (let i of Object.keys(dataRow))
        dataRow[i] = !isNaN(i) ? +dataRow[i] : dataRow[i];
    })
    data.sort((a, b) => - a['2020'] + b['2020'])
    // maxPopulation = data[data.length - 1]['2020'];
    totalCount = data.length;
    visualize(data.slice(startCount, startCount + count), '2020', 'Country');
    select('select#yearinput')
      .selectAll('option')
      .data(data.columns.slice(2).map(data=>+data).sort((a,b)=>b-a))
      .enter()
      .append('option')
      .text(data => data)
      .attr('value', data => data);
  })


const submitForm = (e,form) => {
  e.preventDefault();
  if (form.order.checked !== reversed) {
    reversed = form.order.checked;
    data.sort((a, b) => {
      if (reversed) return - a[form.yearinput.value] + b[form.yearinput.value];
      else return a[form.yearinput.value] - b[form.yearinput.value]
    })
  }
  visualize(data.slice(startCount, startCount + count), form.yearinput.value, 'Country');
}

const up = (is) => {
  if (is && startCount <= 0) {
    document.querySelector("button#up").setAttribute('disabled','disabled');
    return
  }else if (!is && startCount >= totalCount - count) {
    document.querySelector("button#down").setAttribute('disabled', 'disabled');
    return
  }
  document.querySelector("button#up").disabled = false;
  document.querySelector("button#down").disabled = false;
  startCount = startCount + (is ? -1 : 1);
  visualize(data.slice(startCount, startCount + count), document.forms[0].yearinput.value, 'Country');
}
const zoom = (is) => {
  if (is && count <= minCount) {
    document.querySelector("button#zoom").disabled = true;
    return
  }else if (!is && count >= maxCount) {
    document.querySelector("button#zoomout").disabled = true;
    return
  }
  document.querySelector("button#zoom").disabled = false;
  document.querySelector("button#zoomout").disabled = false;
  count = count + (is ? -1 : 1);
  visualize(data.slice(startCount, startCount + count), document.forms[0].yearinput.value, 'Country');
}