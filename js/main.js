$(function () {
  var options = {
    amplitude: 10,
    frequency: 1,
    harmonic: 5,
    sample: 360,
    details: true
  };
  $(".busy").fadeOut(0);
  drawPlot(options);

  $("input").on("change", function () {
    var value = +this.value;
    var id = this.id;

    if (id == "harmonic") {
      if ((value & 1) == 0) {
        if (options.harmonic < value) {
          value = (value + 1);
        } else {
          value = (value - 1);
        }
      }

      if (value > 1000) {
        value = 999;
      }
    }

    if (value < 1) {
      value = 1;
    }

    if (id == "details") {
      options.details = this.checked;
    } else {
      this.value = value;
      options[id] = value;
    }


    if(options.harmonic > 100) {
      $(".busy").fadeIn(300);
      setTimeout(function () {
        drawPlot(options);
      }, 300);
    } else {
      drawPlot(options);
    }
  });
});


function drawPlot (options) {
  var placeHolder = $("#placeholder");
  placeHolder.html("");

  var graphValueCollection = [],
    sample = options.sample,
    graphCollection = [],
    squareGraph = [], N, i, m, plot;

  for (N = 1; N < options.harmonic; N += 2) {
    var graphValues = [];
    for (i = 0; i < 1; i += 1 / sample) {
      graphValues.push([i, 4 * options.amplitude / (N * Math.PI) * Math.sin(N * Math.PI * options.frequency * 2 * i)]);
    }
    graphValueCollection.push(graphValues);
  }

  if (options.details == true) {
    graphValueCollection.forEach(function (e) {
      graphCollection.push({data: e, shadowSize: 0});
    });
  }

  var length = graphValueCollection[0].length;
  for (i = 0; i < length; i++) {
    var total = 0;

    for (m = 0; m < graphValueCollection.length; m++) {
      total += graphValueCollection[m][i][1];
    }

    squareGraph[i] = [i / sample, total];
  }

  graphCollection.push({data: squareGraph, shadowSize: 0, color: "black", label: "V(x) = -0.00"});

  plot = $.plot("#placeholder", graphCollection, {
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

  plotValue(plot, placeHolder, options);
}