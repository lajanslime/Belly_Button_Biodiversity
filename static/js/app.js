//Identity File Path 
 
file_path = "data/samples.json";

// define dropdown 

var dropdown = d3.select("#selDataset")


function buildCharts(sample) {
        // - loop over the samples.json file with d3.json().then()
        d3.json(file_path).then((data) => {
          // - extract the samples from the json
          var samples = data.samples;
          // - filter the samples for the sample id
          var values = samples.filter(sampleObj => sampleObj.id == sample);
          var value = values[0];
          // - extract the ids, labels, and values 
          var otu_ids = value.otu_ids;
          var otu_labels = value.otu_labels;
          var sample_values = value.sample_values;
      
          // - build a bubble chart 
          var bubbleData = [{
              x: otu_ids,
              y: sample_values,
              text: otu_labels,
              mode: "markers",
              marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'YlGnBu'
              }
            }];
          var bubbleLayout = {
                margin: { t: 0 },
                hovermode: "closest",
                xaxis: { title: "OTU ID" },
              };
    
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
          // - build a bar chart 
          var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
          var barData = [{
                y: yticks,
                x: sample_values.slice(0, 10).reverse(),
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h",
            }];
    
          var barLayout = {
            margin: { t: 50, l: 100 }
            };
    
          Plotly.newPlot("bar", barData, barLayout);
        });
}

function buildTable(sample) {
    // Pull Data
    d3.json(file_path).then((data) => {
        var metadata = data.metadata;

        // Filter metadata for ID
        var sampleData = metadata.filter(row => row.id == sample)[0];

        // Create variable
        var tableData = d3.select("#sample-metadata");
        tableData.html("");

        // Add key and value to chart data
        Object.entries(sampleData).forEach(([key, value]) => {
            tableData.append("h5").text(`${key}: ${value}`);
        });
    });
};

// Populate dropdown menu and populate charts based 
function init() {
    // Pull Data
    d3.json(file_path).then((data) => {
    
        //  Populate drowndown with IDs 
        data.names.forEach((name => {
            var option = dropdown.append("option");
            option.text(name);
        }));
  
        // Use first dataset to populate default charts
        var sampleNames = data.names[0];

        buildTable(sampleNames);
        buildCharts(sampleNames);
    });
};


//Update sample 
function optionChanged(newSample) {
    buildTable(newSample);
    buildCharts(newSample);
}

//Initialize the dashboard 

init();