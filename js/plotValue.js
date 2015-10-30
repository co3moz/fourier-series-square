function plotValue(plot, placeHolder, options) {
  var legends = placeHolder.find(".legendLabel");

  legends.each(function () {
    $(this).css('width', $(this).width());
  });

  var updateLegendTimeout = null;
  var latestPosition = null;

  function updateLegend () {
    updateLegendTimeout = null;
    var pos = latestPosition;
    var axes = plot.getAxes();
    if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
      pos.y < axes.yaxis.min || pos.y > axes.yaxis.max) {
      return;
    }
    var i, j, dataset = plot.getData();
    i = dataset.length - 1;
    var series = dataset[i];
    for (j = 0; j < series.data.length; ++j) {
      if (series.data[j][0] > pos.x) {
        break;
      }
    }
    var y, p1 = series.data[j - 1], p2 = series.data[j];
    if (p1 == null) {
      y = p2[1];
    } else if (p2 == null) {
      y = p1[1];
    } else {
      y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
    }
    legends.text(series.label.replace(/=.*/, "= " + y.toFixed(2)));
  }
  placeHolder.bind("plothover", function (event, pos, item) {
    latestPosition = pos;
    if (!updateLegendTimeout) {
      updateLegendTimeout = setTimeout(updateLegend, 50);
    }
  });

  setTimeout(function() {
    $(".busy").fadeOut(300);
  }, 300)
}

window.plotValue = plotValue;