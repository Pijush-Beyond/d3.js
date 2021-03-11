const { csv, select, selectAll } = d3;

const svg = select('svg#visualization');
if (!svg.attr('width')) svg.attr('width', Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 20)
if (!svg.attr('height')) svg.attr('height', 1200)
const width = +svg.attr('width');
const height = +svg.attr('height');
const data = [];
data.colmuns = ['Year'];
var fileCount = 0;

csv('a1-film.csv', recivedData => {
  const emptyColumn = {};
  recivedData.forEach(d => {
    if (emptyColumn[d.Subject] === undefined) {
      data.colmuns.push(d.Subject);
      emptyColumn[d.Subject] = 0;
    }
  })
  recivedData.forEach(d => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].Year === +d.Year) {
        data[i][d.Subject]++;
        return;
      } else if (data[i].Year < +d.Year) continue;
      else {
        data.splice(i, 0, { Year: +d.Year, ...emptyColumn})
        return;
      }
    }
    data.push({Year: +d.Year, ...emptyColumn});
  })
  visualization();
})