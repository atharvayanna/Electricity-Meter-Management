import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const BarChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth()-6)

    const filteredData = data.filter(item => {
      const readingDate = new Date(item.reading_date);
      return readingDate >= sixMonthsAgo && readingDate.getMonth()<today.getMonth();
    });

    const monthlyConsumption = {};
    filteredData.forEach(item => {
      const readingDate = new Date(item.reading_date);
      const month = readingDate.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (monthlyConsumption[month]) {
        monthlyConsumption[month] += item.reading_value;
      } else {
        monthlyConsumption[month] = item.reading_value;
      }
    });

    const sortedChartData = Object.entries(monthlyConsumption)
      .map(([month, totalConsumption]) => ({
        category: month,
        value: totalConsumption,
      }))
      .sort((a, b) => new Date(b.category) - new Date(a.category)); 

    setChartData(sortedChartData);
  }, [data]);

  useEffect(() => {
    if (chartData.length > 0) {
      let chart = am4core.create('barchart', am4charts.XYChart);
      chart.data = chartData;

      // chart title
      let title = chart.titles.create();
      title.text = 'Monthly Consumption';
      title.fontSize = 20;
      title.marginBottom = 15;
      title.fontWeight = 'bold';

      // X-axis Value Axis
      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Consumption (Units)';
      valueAxis.title.fontSize = 15;
      valueAxis.title.fontWeight = 'bold';

      // Y-axis Category Axis
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.title.text = 'Month';
      categoryAxis.title.fontSize = 15;
      categoryAxis.title.fontWeight = 'bold';
      categoryAxis.renderer.minGridDistance = 20;

      // Alternate Y-axis labels
      // categoryAxis.renderer.labels.template.adapter.add('dy', (dy, target) => {
      //   // Adjust the label placement for alternation
      //   return target.index % 2 === 0 ? dy : dy + 10;
      // });

      // Horizontal bars
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueX = 'value';
      series.dataFields.categoryY = 'category';
      series.name = 'Consumption';
      series.columns.template.tooltipText = '{categoryY}: [bold]{valueX}[/]';
      series.columns.template.fillOpacity = 0.8;

      return () => {
        chart.dispose();
      };
    }
  }, [chartData]);

  return (
    <div id="barchart" style={{ width: '95%', height: '25rem' }}></div>
  );
};

export default BarChart;
