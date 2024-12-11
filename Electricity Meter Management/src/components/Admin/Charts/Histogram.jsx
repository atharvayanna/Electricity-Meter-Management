import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const Histogram = ({ data }) => {
  const [histogramData, setHistogramData] = useState([]);

  const updateChart = ()=>{
    
  }

  useEffect(() => {
    // Extract the reading values from the data
    const readingValues = data.map(item => item.reading_value);

    // Define bins for the histogram (adjust these values as needed)
    const binSize = 50;
    const maxValue = Math.max(...readingValues);
    const minValue = Math.min(...readingValues);
    const numberOfBins = Math.ceil((maxValue - minValue) / binSize);

    // Create an array to hold the bin counts
    const bins = Array(numberOfBins).fill(0);

    // Assign each reading value to a bin
    readingValues.forEach(value => {
      const binIndex = Math.floor((value - minValue) / binSize);
      bins[binIndex]++;
    });

    // Prepare data for the histogram chart
    const histogramData = bins.map((count, index) => {
      const startRange = minValue + index * binSize;
      const endRange = startRange + binSize;
      return {
        range: `${startRange} - ${endRange}`,
        count: count,
      };
    });

    setHistogramData(histogramData);
  }, [data]);

  useEffect(() => {
    // Create the chart only if the data has been set
    if (histogramData.length > 0) {
      let chart = am4core.create('histogramChart', am4charts.XYChart);

      // Set chart data
      chart.data = histogramData;

      // Add chart title
      let title = chart.titles.create();
      title.text = 'Histogram of Reading Values';
      title.fontSize = 20;
      title.marginBottom = 15;
      title.fontWeight = 'bold';

      // Create X and Y axes
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'range';
      categoryAxis.title.text = 'Reading Value Range';
      categoryAxis.title.fontWeight = 'bold';

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Frequency';
      valueAxis.title.fontWeight = 'bold';

      // Create the histogram bars
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = 'count';
      series.dataFields.categoryX = 'range';
      series.name = 'Frequency';
      series.columns.template.tooltipText = '{categoryX}: [bold]{valueY}[/]';

      // Tooltip configuration
      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;

      // Clean up chart on component unmount
      return () => {
        chart.dispose();
      };
    }
  }, [histogramData]);

  return <div id="histogramChart" style={{ width: '95%', height: '25rem' }}></div>;
};

export default Histogram;
