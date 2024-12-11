import React, { useEffect, useState } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const LineChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth()-6)

    const filteredData = data.filter(item => {
      const readingDate = new Date(item.reading_date);
      return readingDate >= sixMonthsAgo && readingDate.getMonth()<today.getMonth();
    });

    const monthlyRevenue = {};
    filteredData.forEach(item => {
      const readingDate = new Date(item.reading_date);
      const month = readingDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      const revenue = item.reading_value * 5;

      if (monthlyRevenue[month]) {
        monthlyRevenue[month] += revenue;
      } else {
        monthlyRevenue[month] = revenue;
      }
    });

    const chartData = Object.entries(monthlyRevenue).map(([month, totalRevenue]) => ({
      category: month,
      value: totalRevenue,
    }));

    const sortedChartData = chartData.sort((a, b) => new Date(b.category) - new Date(a.category));
    setChartData(sortedChartData);
  }, [data]);

  useEffect(() => {
    if (chartData.length > 0) {
      let chart = am4core.create('linechart', am4charts.XYChart);
      chart.data = chartData;

      // chart title
      let title = chart.titles.create();
      title.text = 'Monthly Revenue';
      title.fontSize = 20;
      title.marginBottom = 15;
      title.fontWeight = 'bold';

      // X-axis
      let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      categoryAxis.dataFields.category = 'category';
      categoryAxis.title.text = 'Month';
      categoryAxis.title.fontWeight = 'bold';
      categoryAxis.renderer.inversed = true;

      //Y-axis
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.title.text = 'Revenue (Rs)';
      valueAxis.title.fontWeight = 'bold';

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = 'value';
      series.dataFields.categoryX = 'category';
      series.name = 'Revenue';
      series.strokeWidth = 2;
      series.tensionX = 0.8;
      series.tooltipText = '{categoryX}: [bold]{valueY}[/]';

      let bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.fill = am4core.color('#007bff');
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

  return <div id="linechart" style={{ width: '95%', height: '25rem' }}></div>;
};

export default LineChart;
