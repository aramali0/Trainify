
import ApexCharts from "apexcharts";

var colors = ["#14b8a6", "#0ea5e9", "#3b82f6"];
var dataColors = document.querySelector("#earning_report").dataset.colors;
if (dataColors) {
  colors = dataColors.split(",");
}

var options = {
  series: [
    {
      name: "Courses",
      type: "area",
      data: [26, 46, 22, 70, 30, 40, 20, 44, 20, 80, 42, 66],
    },
    {
      name: "Time",
      type: "bar",
      data: [
        89.25, 98.58, 68.22, 108.46, 77.54, 84.03, 51.24, 28.57, 92.57, 42.36,
        88.51, 36.57,
      ],
    },
    {
      name: "Pending Courses",
      type: "line",
      data: [12, 22, 9, 34, 10, 23, 9, 20, 6, 26, 19, 35],
    },
  ],
  chart: {
    height: 390,
    type: "line",
    toolbar: { show: !1 },
  },
  stroke: {
    curve: "straight",
    dashArray: [0, 0, 8],
    width: [0.1, 0, 2],
  },
  fill: {
    opacity: [0.2, 0.9, 1],
  },
  markers: {
    size: [0, 0, 0],
    strokeWidth: 2,
    hover: { size: 4 },
  },
  xaxis: {
    categories: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    axisTicks: { show: !1 },
    axisBorder: { show: !1 },
  },
  grid: {
    show: !0,
    xaxis: { lines: { show: !0 } },
    yaxis: { lines: { show: !1 } },
    padding: { top: 0, right: -2, bottom: 15, left: 10 },
  },
  legend: {
    show: !0,
    horizontalAlign: "center",
    offsetX: 0,
    offsetY: -5,
    markers: { width: 9, height: 9, radius: 6 },
    itemMargin: { horizontal: 10, vertical: 0 },
  },
  plotOptions: {
    bar: { columnWidth: "20%", barHeight: "100%", borderRadius: [5] },
  },
  colors: colors,
  tooltip: {
    shared: !0,
    y: [
      {
        formatter: function (e) {
          return void 0 !== e ? e.toFixed(0) : e;
        },
      },
      {
        formatter: function (e) {
          return void 0 !== e ? e.toFixed(2) : e;
        },
      },
      {
        formatter: function (e) {
          return void 0 !== e ? e.toFixed(0) : e;
        },
      },
    ],
  },
};
var chart = new ApexCharts(document.querySelector("#earning_report"), options);

// // //

chart.render();
var colors = ["#0ea5e9", "#71717a"];
var dataColors = document.querySelector("#today_courses").dataset.colors;
if (dataColors) {
  colors = dataColors.split(",");
}

var options = {
  series: [80],
  chart: {
    width: 110,
    height: 110,
    type: "radialBar",
    sparkline: { enabled: !0 },
  },
  plotOptions: {
    radialBar: {
      hollow: { margin: 0, size: "50%" },
      track: { margin: 0, background: colors, opacity: 0.2 },
      dataLabels: { show: !1 },
    },
  },
  grid: { padding: { top: -15, bottom: -15 } },
  stroke: { lineCap: "round" },
  labels: ["Cricket"],
  colors: colors,
};

var chart = new ApexCharts(document.querySelector("#today_courses"), options);

chart.render();

// // // //

// var colors = ["#0ea5e9", "#71717a"];
// var dataColors = document.querySelector("#stroked_radialbar").dataset.colors;
// if (dataColors) {
//   colors = dataColors.split(",");
// }

// var options = {
//   series: [67],
//   chart: { height: 320, type: "radialBar" },
//   plotOptions: {
//     radialBar: {
//       startAngle: -120,
//       endAngle: 120,
//       dataLabels: {
//         name: { fontSize: "16px", color: void 0, offsetY: 80 },
//         value: {
//           offsetY: 30,
//           fontSize: "20px",
//           color: "#87888a",
//           formatter: function (t) {
//             return t + "%";
//           },
//         },
//       },
//     },
//   },
//   grid: {
//     show: !1,
//     padding: { top: -15, right: 0, left: 0, bottom: -10 },
//     yaxis: { lines: { show: !1 } },
//   },
//   fill: {
//     type: "gradient",
//     gradient: {
//       shade: "dark",
//       shadeIntensity: 0.15,
//       inverseColors: !1,
//       opacityFrom: 1,
//       opacityTo: 1,
//       stops: [0, 50, 65, 91],
//     },
//   },
//   stroke: { dashArray: 4 },
//   labels: ["Your Daily Goal"],
//   color: "#87888a",
// };

// var chart = new ApexCharts(
//   document.querySelector("#stroked_radialbar"),
//   options
// );

// chart.render();

// var colors = ["#0ea5e9", "#71717a"];
// var dataColors = document.querySelector("#earning_report").dataset.colors;
// if (dataColors) {
//   colors = dataColors.split(",");
// }

// var options = {
//   series: [
//     {
//       name: "Paid",
//       data: [55, 55, 42, 42, 55, 55, 38, 38, 53, 53, 35, 35],
//       type: "line",
//     },
//     {
//       name: "UnPaid",
//       data: [35, 35, 46, 46, 35, 35, 48, 48, 33, 33, 38, 38],
//       type: "line",
//     },
//   ],
//   chart: {
//     height: 270,
//     toolbar: {
//       show: false,
//     },
//     background: "none",
//     fill: "#fff",
//   },
//   grid: {
//     borderColor: colors,
//   },
//   colors: colors,
//   background: "transparent",
//   dataLabels: {
//     enabled: false,
//   },
//   stroke: {
//     curve: "smooth",
//     width: 2,
//     dashArray: [0, 5],
//   },
//   xaxis: {
//     type: "month",
//     categories: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//   },
//   dataLabels: {
//     enabled: false,
//   },
//   legend: {
//     show: false,
//   },
//   xaxis: {
//     show: false,
//     axisBorder: {
//       show: false,
//       color: "rgba(119, 119, 142, 0.05)",
//       offsetX: 0,
//       offsetY: 0,
//     },
//     axisTicks: {
//       show: false,
//       borderType: "solid",
//       color: "rgba(119, 119, 142, 0.05)",
//       width: 6,
//       offsetX: 0,
//       offsetY: 0,
//     },
//     labels: {
//       rotate: -90,
//     },
//   },
//   yaxis: {
//     show: false,
//     axisBorder: {
//       show: false,
//     },
//     axisTicks: {
//       show: false,
//     },
//   },
//   tooltip: {
//     x: {
//       format: "dd/MM/yy HH:mm",
//     },
//   },
// };
// var chart = new ApexCharts(document.querySelector("#earning_report"), options);
