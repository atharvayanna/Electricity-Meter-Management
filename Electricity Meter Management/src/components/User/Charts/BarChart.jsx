import React, { useEffect } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

function BarChart({props}) {

  const updateChart = ()=>{
    // Sample data
    // const meterReadings = [
    //   { "reading_date": "2023-12-31T18:30:00.000Z", "reading_value": 200, "billing_amount": 1000, "is_paid": "No" },
    //   { "reading_date": "2024-02-01T18:30:00.000Z", "reading_value": 180, "billing_amount": 900, "is_paid": "No" },
    //   { "reading_date": "2024-03-01T18:30:00.000Z", "reading_value": 180, "billing_amount": 900, "is_paid": "No" },
    //   { "reading_date": "2024-04-02T18:30:00.000Z", "reading_value": 180, "billing_amount": 900, "is_paid": "No" },
    //   { "reading_date": "2024-05-01T18:30:00.000Z", "reading_value": 180, "billing_amount": 900, "is_paid": "No" },
    //   { "reading_date": "2024-05-31T18:30:00.000Z", "reading_value": 160, "billing_amount": 800, "is_paid": "No" },
    //   { "reading_date": "2024-06-30T18:30:00.000Z", "reading_value": 165, "billing_amount": 825, "is_paid": "No" },
    //   { "reading_date": "2024-08-09T18:30:00.000Z", "reading_value": 185, "billing_amount": 925, "is_paid": "No" },
    //   { "reading_date": "2024-09-08T18:30:00.000Z", "reading_value": 180, "billing_amount": 900, "is_paid": "No" },
    //   { "reading_date": "2024-10-08T18:30:00.000Z", "reading_value": 175, "billing_amount": 875, "is_paid": "No" },
    //   { "reading_date": "2024-10-31T18:30:00.000Z", "reading_value": 175, "billing_amount": 875, "is_paid": "No" },
    //   { "reading_date": "2024-11-30T18:30:00.000Z", "reading_value": 155, "billing_amount": 775, "is_paid": "No" },
    //   { "reading_date": "2024-12-31T18:30:00.000Z", "reading_value": 160, "billing_amount": 800, "is_paid": "No" }
    // ];

    console.log(props)
    const meterReadings = props.meterData; 

    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 7));
    const recentReadings = meterReadings.filter(item => new Date(item.reading_date) > sixMonthsAgo);

    const chartData = recentReadings.map(item => {
      const date = new Date(item.reading_date);
      const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      return { category: month, value: item.reading_value };
    });

    let chart = am4core.create('barchart', am4charts.XYChart);
    chart.data = chartData;

    // Chart Title
    let title = chart.titles.create();
    title.text = 'Monthly Consumption';
    title.fontSize = 20;
    title.marginBottom = 15;
    title.fontWeight = 'bold'

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'category';
    categoryAxis.renderer.inversed = true;  

    // X-axis
    let valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Consumption (Units)';
    valueAxis.title.fontSize = 15;
    valueAxis.title.fontWeight = "bold";

    // Y-axis
    categoryAxis.title.text = 'Month';
    categoryAxis.title.fontSize = 15;
    categoryAxis.title.fontWeight = "bold";
    categoryAxis.renderer.minGridDistance = 20;  

    // Create series
    let series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueX = 'value';  
    series.dataFields.categoryY = 'category';  
    series.name = 'Reading Value';
    series.columns.template.tooltipText = '{categoryY}: [bold]{valueX}[/]';
    series.columns.template.fillOpacity = 0.8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 0;
    columnTemplate.strokeOpacity = 1;

    return () => {
      chart.dispose();
    };
  }
  useEffect(() => {
    updateChart()
  }, []);

  useEffect(()=>{
    updateChart();
  },[props.meterData])

  return (
    <div id="barchart" style={{ width: '95%', height: '25rem' }}></div>
  );
}

export default BarChart;
