import React, { useEffect } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const LineChart = ({ props }) => {
  const chartUpdate = () => {
    const meterReadings = props.meterData;
    const today = new Date();
    const sixMonthsAgo = new Date(today.setMonth(today.getMonth() - 6));
    const recentReadings = meterReadings.filter(
      (item) => new Date(item.reading_date) > sixMonthsAgo
    );

    const chartData = recentReadings.map((item) => {
      const date = new Date(item.reading_date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      return { category: month, value: item.billing_amount };
    });

    let chart = am4core.create("linechart", am4charts.XYChart);
    chart.data = chartData;

    let title = chart.titles.create();
    title.text = "Monthly Expense";
    title.fontSize = 20;
    title.marginBottom = 15;
    title.fontWeight = "bold";

    // X-axis
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.title.text = "Month";
    categoryAxis.title.fontWeight = "bold";
    categoryAxis.renderer.inversed = true;

    //Y-axis
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Billing Amount";
    valueAxis.title.fontWeight = "bold";

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "category";
    series.name = "Billing Amount";
    series.strokeWidth = 2;
    series.tensionX = 0.8;
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";

    let bullet = series.bullets.push(new am4charts.CircleBullet());
    bullet.circle.fill = am4core.color("#007bff");
    bullet.circle.strokeWidth = 2;
    bullet.circle.stroke = am4core.color("#fff");

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

    return () => {
      chart.dispose();
    };
  };
  useEffect(() => {
    chartUpdate();
  }, []);

  useEffect(() => {
    chartUpdate();
  }, [props.meterData]);

  return <div id="linechart" style={{ width: "95%", height: "25rem" }}></div>;
};

export default LineChart;
