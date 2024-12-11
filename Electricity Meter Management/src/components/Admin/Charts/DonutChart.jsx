import React, { useEffect, useState } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

const DonutChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    const filteredData = data.filter((item) => {
      const readingDate = new Date(item.reading_date);
      return readingDate >= sixMonthsAgo;
    });

    let paidAmount = 0;
    let unpaidAmount = 0;

    filteredData.forEach((item) => {
      if (item.is_paid === "yes") {
        paidAmount += item.billing_amount;
      } else {
        unpaidAmount += item.billing_amount;
      }
    });

    const chartData = [
      {
        category: "Paid",
        value: paidAmount,
        color: "#4caf50",
      },
      {
        category: "Unpaid",
        value: unpaidAmount,
        color: "#f44336",
      },
    ];

    setChartData(chartData);
  }, [data]);

  useEffect(() => {
    if (chartData.length > 0) {
      const chart = am4core.create("donutchart", am4charts.PieChart);
      chart.data = chartData;

      //chart title
      const title = chart.titles.create();
      title.text = "Billing Status";
      title.fontSize = 20;
      // title.marginBottom = 15;
      title.marginTop = 16;
      title.fontWeight = "bold";

      chart.radius = am4core.percent(80);
      chart.innerRadius = am4core.percent(40);

      const pieSeries = chart.series.push(new am4charts.PieSeries());

      pieSeries.dataFields.category = "category";
      pieSeries.dataFields.value = "value";

      pieSeries.slices.template.stroke = am4core.color("#ffffff");
      pieSeries.slices.template.strokeWidth = 2;

      // Add labels to the slices
      //   pieSeries.labels.template.text = '{category}: {value} ({percentage}%)';
      //   pieSeries.labels.template.fontSize = 14;

      //   pieSeries.ticks.template.disabled = true; // Disable ticks to clean up the chart
      //   pieSeries.tooltipText = '{category}: {value} ({percentage}%)'; // Tooltip content

      chart.legend = new am4charts.Legend();

      return () => {
        chart.dispose();
      };
    }
  }, [chartData]);

  return <div id="donutchart" style={{ width: "95%", height: "25rem" }}></div>;
};

export default DonutChart;
