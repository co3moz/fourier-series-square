function drawPlot (ayar) {
  var placeHolder = $("#placeholder");
  placeHolder.html("");

  var d = [];
  for (var k = 0; k < ayar.harmonik - 2; k++) {
    var y = [];
    var N = (2 * k + 1);
    for (var i = 0; i < 1; i += 1 / 360) {
      y.push([i, 4 * ayar.genlik / (N * Math.PI) * Math.sin(N * Math.PI * ayar.frekans * 2 * i)]);
    }
    d.push(y);
  }

  var z = [];
  d.forEach(function (e, k) {
    z.push({data: e, shadowSize: 0});
  });

  var allMix = [];
  for (i = 0; i <= 360; i++) {
    var total = 0;

    for (var m = 0; m < d.length; m++) {
      total += d[m][i][1];
    }

    allMix[i] = [i / 360, total];
  }

  z.push({data: allMix, shadowSize: 0, color: "black", label: "V(x) = -0.00"});

  var plot = $.plot("#placeholder", z, {
    series: {
      lines: {
        show: true
      }
    },
    crosshair: {
      mode: "x"
    },
    grid: {
      hoverable: true,
      autoHighlight: false
    }
  });


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
}


$(function () {
  var ayar = {
    genlik: 10,
    frekans: 1,
    harmonik: 5
  };
  drawPlot(ayar);

  $("input").on("change", function () {
    ayar[this.id] = +this.value;
    drawPlot(ayar);
  });
});
