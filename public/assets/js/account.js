import ApexCharts from "apexcharts";

import colors from "tailwindcss/colors";

var options = {
    series: [33],
    chart: { height: 165, type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
        radialBar: {
            hollow: { margin: 0, size: "50%" },
            track: { margin: 0 },
            track: {
                background: colors.indigo[100],
            },
            dataLabels: { show: false },
        },
    },
    stroke: {
        lineCap: "round"
    },
    labels: ["Instructor Total"],
    colors: [colors.indigo[600]],
    responsive: [{ breakpoint: 1600, options: { chart: { height: 150 } } }],
};

var chart = new ApexCharts(document.querySelector("#working_hour"), options);

chart.render();
var options = {
    series: [66],
    chart: { height: 165, type: "radialBar", sparkline: { enabled: true } },
    plotOptions: {
        radialBar: {
            hollow: { margin: 0, size: "50%" },
            track: { margin: 0 },
            track: {
                background: colors.teal[100],
            },
            dataLabels: { show: false },
        },
    },
    stroke: {
        lineCap: "round"
    },
    labels: ["Instructor Total"],
    colors: [colors.teal[600]],
    responsive: [{ breakpoint: 1600, options: { chart: { height: 150 } } }],
};

var chart = new ApexCharts(document.querySelector("#instructors"), options);

chart.render();
