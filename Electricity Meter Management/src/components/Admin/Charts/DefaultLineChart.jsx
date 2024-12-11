import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const DefaultLineChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth()-6)

    const filteredData = data.filter(item => {
      const readingDate = new Date(item.reading_date);
      return readingDate >= sixMonthsAgo && readingDate.getMonth()<today.getMonth();
    });
    const unpaidRecords = filteredData.filter(item => item.is_paid === "No");

    const unpaidByMonth = {};
    unpaidRecords.forEach(item => {
      const date = new Date(item.reading_date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!unpaidByMonth[month]) {
        unpaidByMonth[month] = 0;
      }
      unpaidByMonth[month] += item.billing_amount;
    });

    const chartData = Object.keys(unpaidByMonth).map(month => ({
      category: month,
      value: unpaidByMonth[month],
    }));

    chartData.sort((a, b) => new Date(a.category) - new Date(b.category));

    setChartData(chartData);
  }, [data]);

  useEffect(() => {
    if (chartData.length > 0) {
      let chart = am4core.create('lineChart', am4charts.XYChart);
      chart.data = chartData;

      // chart title
      let title = chart.titles.create();
      title.text = 'Monthly Default Amount';
      title.fontSize = 20;
      title.marginBottom = 15;
      title.fontWeight = 'bold';

      // X-axis
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.title.text = 'Month';
      categoryAxis.title.fontWeight = 'bold';

      //Y-axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Default Amount';
      valueAxis.title.fontWeight = 'bold';

      // Create the series
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'category';
      series.name = 'Default Amount (Rs)';
      series.strokeWidth = 2;
      series.tensionX = 0.8;
      series.tooltipText = '{categoryX}: [bold]{valueY}[/]';

      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.fill = am4core.color('#ff0000');
      bullet.circle.strokeWidth = 2;
      bullet.circle.stroke = am4core.color('#fff');

      chart.cursor = new am4charts.XYCursor();
      chart.cursor.lineX.strokeOpacity = 0;
      chart.cursor.lineY.strokeOpacity = 0;

      return () => {
        chart.dispose();
      };
    }
  }, [chartData]);

  return <div id="lineChart" style={{ width: '95%', height: '25rem' }}></div>;
};

export default DefaultLineChart;
