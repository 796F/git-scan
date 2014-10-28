var MAIN = {}

MAIN.init = function() {
  $.get("data", function(data) {
      var yAxis = data.map(function(entry){
        return entry.full_name;
      });
      var series = data.map(function(entry){
        return [entry.created_at, entry.pushed_at];
      });

      $('#chart').highcharts({

        chart: {
            type: 'columnrange',
            inverted: true
        },
        xAxis: {
            categories: yAxis
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'repo activity',
            data: series
        }]

    });
      
  });
}

$(MAIN.init);
