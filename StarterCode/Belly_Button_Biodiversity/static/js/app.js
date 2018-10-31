function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

  d3.json(`/metadata/${sample}`).then(function(data) {
          // Use `.html("") to clear any existing metadata
    var DataCue = d3.select("#sample-metadata");
    DataCue.html("");
  // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
      var response = data;

      Object.entries(data).forEach(function([key, value]) {
        DataCue.append("h6").text(`${key}:${value}`);
      console.log(key,value);
      });  
    });
};
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
function buildCharts(sample) {
    // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data
    // use otu_ids for x values
    // use sample_values for y values
    // use sample_values for marker size
    // use otu_ids for the marker colors
    // use otu_labels for the text values
  d3.json(`/samples/${sample}`).then(function(Chartdata){
    var clearcharts = d3.select("#pie");
    clearcharts.html("");
    var otu_ids = Chartdata.otu_ids;
    var otu_labels = Chartdata.otu_labels;
    var sample_values = Chartdata.sample_values;

    var bubbleLayout = {
      xaxis: {
        title: "OTU ID"
      },
      hovermode: "closest",
      margin: {t:0}
    };

    var bubble_data = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: sample_values,
        color : otu_ids,
        colorscale : "Earth"
      },
      text: otu_labels
    };

    var bubble_chart = [bubble_data]
    Plotly.plot("bubble", bubble_chart, bubbleLayout);

        // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
        // use sample_values as value for the PIE chart
    // use otu_ids as the labels for the pie chart
    // use otu_labels as the hovertext for the chart
    var pieLayout = {
      xaxis: {
        title: "Pie Chart Name Here",
      },
      margin: {t:0}
    };
    var pie_data = [{
      values : sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext:otu_labels.slice(0,10),
      hoverinfo: "hovertext",
      text: otu_labels.slice(0,10),
      type: "pie"
    }];
    Plotly.plot("pie", pie_data, pieLayout);
    
    });
};

  // buildPlots();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
