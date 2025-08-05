// "use client"

// import Highcharts from "highcharts"
// import HighchartsReact from "highcharts-react-official"
// import HighchartsMore from "highcharts/highcharts-more"
// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

// // Initialize Highcharts modules
// if (typeof Highcharts === 'function') {
//     HighchartsMore(Highcharts)
// }

// const AdvancedPolarChart = () => {
//     const [isDarkMode, setIsDarkMode] = useState(false)
//     const darkBg = "#1f1836"
//     const lightBg = "#ffffff"

//     const darkText = "#ffffff"
//     const lightText = "#000000"

//     const chartBg = isDarkMode ? darkBg : lightBg
//     const textColor = isDarkMode ? darkText : lightText
//     const borderColor = isDarkMode ? "#46465C" : "#e0e0e0"
//     const secondaryBg = isDarkMode ? "#023e8a" : "#3a86ff"
//     const secondaryNewBg = isDarkMode ? "rgba(59,130,246,0.1)" : "#eee"

//     const colors = Highcharts.getOptions().colors.map((c: any) => Highcharts.color(c))

//     useEffect(() => {
//         const checkDarkMode = () =>
//             document.documentElement.classList.contains("dark")

//         setIsDarkMode(checkDarkMode())

//         const observer = new MutationObserver(() => {
//             setIsDarkMode(checkDarkMode())
//         })

//         observer.observe(document.documentElement, {
//             attributes: true,
//             attributeFilter: ["class"]
//         })

//         return () => observer.disconnect()
//     }, [])

//     useEffect(() => {
//         const monthlyData = [
//             { date: "01/07/2025", credit: 0, debit: 100 },
//             { date: "02/07/2025", credit: 0, debit: 0 },
//             { date: "03/07/2025", credit: 5000, debit: 300 },
//             { date: "04/07/2025", credit: 4000, debit: 150 },
//             { date: "05/07/2025", credit: 0, debit: 1800 },
//             { date: "06/07/2025", credit: 2000, debit: 200 },
//             { date: "07/07/2025", credit: 0, debit: 0 },
//             { date: "08/07/2025", credit: 1000, debit: 300 },
//             { date: "09/07/2025", credit: 0, debit: 120 },
//             { date: "10/07/2025", credit: 300, debit: 100 },
//             { date: "11/07/2025", credit: 200, debit: 600 },
//             { date: "12/07/2025", credit: 0, debit: 0 },
//             { date: "13/07/2025", credit: 4000, debit: 900 },
//             { date: "14/07/2025", credit: 0, debit: 100 },
//             { date: "15/07/2025", credit: 500, debit: 1100 },
//             { date: "16/07/2025", credit: 0, debit: 0 },
//             { date: "17/07/2025", credit: 1000, debit: 500 },
//             { date: "18/07/2025", credit: 700, debit: 200 },
//             { date: "19/07/2025", credit: 0, debit: 300 },
//             { date: "20/07/2025", credit: 100, debit: 150 },
//             { date: "21/07/2025", credit: 300, debit: 100 },
//             { date: "22/07/2025", credit: 200, debit: 150 },
//             { date: "23/07/2025", credit: 100, debit: 90 },
//             { date: "24/07/2025", credit: 0, debit: 120 },
//             { date: "25/07/2025", credit: 150, debit: 100 },
//             { date: "26/07/2025", credit: 0, debit: 0 },
//             { date: "27/07/2025", credit: 250, debit: 300 },
//             { date: "28/07/2025", credit: 0, debit: 0 },
//             { date: "29/07/2025", credit: 100, debit: 90 },
//             { date: "30/07/2025", credit: 0, debit: 700 },
//             { date: "31/07/2025", credit: 1500, debit: 500 },
//         ]

//         const creditSeries = monthlyData.map((entry, i) => [i + 1, 1, entry.credit])
//         const debitSeries = monthlyData.map((entry, i) => [i + 1, 2, entry.debit])

//         // Convert monthlyData to bubble format: [day, yAxisTeamIndex, value]
//         const teamData = monthlyData.map((entry, index) => {
//             const day = index + 1
//             const credit = entry.credit
//             const debit = entry.debit
//             return [
//                 day, 1, credit
//             ]
//         })
//         const scoreData = [
//             {
//                 x: 1,
//                 low: 0,
//                 high: 5200,
//                 avg: 1733,
//                 highscore: 5000,
//                 topEarner: 'Credit',
//                 week: 1
//             },
//             {
//                 x: 8,
//                 low: 0,
//                 high: 650,
//                 avg: 216,
//                 highscore: 500,
//                 topEarner: 'Credit',
//                 week: 2
//             },
//             {
//                 x: 15,
//                 low: 0,
//                 high: 2200,
//                 avg: 733,
//                 highscore: 1200,
//                 topEarner: 'Credit',
//                 week: 3
//             },
//             {
//                 x: 22,
//                 low: 0,
//                 high: 2330,
//                 avg: 777,
//                 highscore: 2000,
//                 topEarner: 'Credit',
//                 week: 4
//             }
//         ]

//         const chartOptions: Highcharts.Options = {
//             chart: {
//                 polar: true,
//                 height: '100%',
//                 backgroundColor: 'transparent',
//                 events: {
//                     load: function () {
//                         const midPane = this.pane[1]
//                             ; (this as any).setMidPaneBg = function (background: any) {
//                                 midPane.update({ background })
//                             }
//                     }
//                 }
//             },
//             title: {
//                 text: undefined,
//                 style: {
//                     color: textColor,
//                     fontSize: '18px'
//                 }
//             },
//             subtitle: {
//                 text: undefined,
//                 useHTML: true,
//                 align: 'center',
//                 y: 35,
//                 verticalAlign: 'middle',
//                 style: {
//                     fontSize: '1.4em',
//                     color: textColor
//                 }
//             },
//             pane: [
//                 {
//                     size: '80%',
//                     innerSize: '75%',
//                     startAngle: 0,
//                     endAngle: 360,
//                     background: {
//                         borderColor: isDarkMode ? '#444' : '#ccc',
//                         backgroundColor: {
//                             radialGradient: [1, 0.25, 0.1],
//                             stops: [
//                                 [0, isDarkMode ? '#1e1e1e' : '#fff'],
//                                 [1, isDarkMode ? '#2a2a2a' : '#f4f4f4']
//                             ]
//                         },
//                         innerRadius: '40%'
//                     }
//                 },
//                 {
//                     size: '55%',
//                     innerSize: '45%',
//                     startAngle: 40.5,
//                     endAngle: 319.5,
//                     background: {
//                         borderWidth: 0,
//                         backgroundColor: {
//                             radialGradient: [1, 0.25, 0.1],
//                             stops: [
//                                 [0, chartBg],
//                                 [1, borderColor]
//                             ]
//                         },
//                         outerRadius: '75%'
//                     }
//                 },
//                 {
//                     size: '100%',
//                     innerSize: '88%',
//                     startAngle: 0,
//                     endAngle: 360,
//                     background: {
//                         borderWidth: 1,
//                         borderColor: borderColor,
//                         backgroundColor: secondaryNewBg,
//                         innerRadius: '55%',
//                         outerRadius: '100%'
//                     }
//                 }
//             ],
//             xAxis: [
//                 {
//                     pane: 0,
//                     tickInterval: 1,
//                     lineWidth: 0,
//                     gridLineWidth: 0,
//                     min: 1,
//                     max: 26,
//                     labels: { enabled: false },
//                 },
//                 {
//                     pane: 1,
//                     linkedTo: 0,
//                     gridLineWidth: 0,
//                     lineWidth: 0,
//                     plotBands: Array(3).fill(7).map((weekendOffset, week) => {
//                         const from = weekendOffset * (week + 1)
//                         const to = from - 1
//                         return { from, to, color: '#BBBAC5' }
//                     }),
//                     min: 0,
//                     max: 26,
//                     labels: { enabled: false }
//                 },
//                 {
//                     pane: 2,
//                     tickAmount: 4,
//                     tickInterval: 0.5,
//                     gridLineWidth: 0,
//                     lineWidth: 0,
//                     min: 1,
//                     max: 5,
//                     labels: { enabled: false }
//                 }
//             ],
//             yAxis: [
//                 {
//                     pane: 0,
//                     gridLineWidth: 0.5,
//                     gridLineDashStyle: 'longdash',
//                     gridLineColor: isDarkMode ? '#BBBAC5' : '#7a7a7a',
//                     tickInterval: 1,
//                     title: null,
//                     labels: { enabled: false },
//                     min: 1,
//                     max: 3
//                 },
//                 {
//                     pane: 1,
//                     reversed: true,
//                     gridLineWidth: 0,
//                     tickInterval: 100,
//                     min: 0,
//                     max: 400,
//                     title: null,
//                     labels: { enabled: false }
//                 },
//                 {
//                     pane: 2,
//                     tickInterval: 0.25,
//                     gridLineWidth: 0,
//                     gridLineColor: colors[1].brighten(0.05).toString(),
//                     min: -3,
//                     max: 1,
//                     title: null,
//                     labels: { enabled: false }
//                 }
//             ],
//             legend: {
//                 enabled: true,
//                 floating: true,
//                 layout: 'vertical',
//                 verticalAlign: 'center',
//                 align: 'center',
//                 backgroundColor: 'transparent',
//                 borderRadius: 14,
//                 borderColor: 'transparent',
//                 borderWidth: 0,
//                 itemStyle: {
//                     color: textColor,
//                     fontSize: '0.8em'
//                 },
//                 itemHoverStyle: {
//                     color: isDarkMode ? '#BBBAC5' : '#333',
//                     fontSize: '0.9em'
//                 }
//             },
//             series: [
//                 // Team series (bubbles)
//                 {
//                     type: 'bubble',
//                     name: 'Credit',
//                     data: creditSeries,
//                     color: colors[9 % colors.length].tweenTo(colors[0], 0.25).toString(),
//                     marker: {
//                         fillColor: colors[9 % colors.length].tweenTo(colors[0], 0.25).toString(),
//                         lineColor: colors[9 % colors.length].tweenTo(colors[0], 0.25).toString(),
//                         lineWidth: 2
//                     },
//                     shadow: true,
//                     maxSize: '4%',
//                     minSize: '1%',
//                     clip: false,
//                     tooltip: {
//                         headerFormat: '<div class="team-day center">' +
//                             '<span class="team-header">' +
//                             '<b class="team-index">Day {point.x}</b></span> ' +
//                             '<span class="team-name" style="border: 0 outset {series.color};">' +
//                             '<b>{series.name}</b></span>',
//                         pointFormat: '<span class="team-points">' +
//                             '</br>' +
//                             '</br><span class="team-salescount-header">Amount:</span>' +
//                             '<span class="team-salescount">{point.z}</span>',
//                         footerFormat: '</div>',
//                         useHTML: true
//                     }
//                 },
//                 {
//                     type: 'bubble',
//                     name: 'Debit',
//                     data: debitSeries,
//                     color: colors[9 % colors.length].tweenTo(colors[8 % colors.length], 0.65).toString(),
//                     marker: {
//                         fillColor: colors[9 % colors.length].tweenTo(colors[8 % colors.length], 0.65).toString(),
//                         lineColor: colors[9 % colors.length].tweenTo(colors[8 % colors.length], 0.65).toString(),
//                         lineWidth: 2
//                     },
//                     shadow: true,
//                     maxSize: '4%',
//                     minSize: '1%',
//                     clip: false,
//                     tooltip: {
//                         headerFormat: '<div class="team-day center">' +
//                             '<span class="team-header">' +
//                             '<b class="team-index">Day {point.x}</b></span>' +
//                             '<span class="team-name" style="border: 0 outset {series.color};">' +
//                             '<b>{series.name}</b></span>',
//                         pointFormat: '<span class="team-points">' +
//                             '</br>' +
//                             '</br><span class="team-salescount-header">Amount:</span>' +
//                             '<span class="team-salescount">{point.z}</span>',
//                         footerFormat: '</div>',
//                         useHTML: true
//                     }
//                 },
//                 {
//                     type: 'column',
//                     name: 'Month',
//                     data: Array(4).fill(0).map((_, index) => ({
//                         dataLabels: {
//                             format: 'Week {x}',
//                             enabled: true,
//                             inside: true,
//                             style: {
//                                 textOutline: 'none',
//                                 fontSize: '0.7em',
//                                 fontWeight: '700',
//                                 textTransform: 'uppercase'
//                             },
//                             textPath: {
//                                 enabled: true,
//                                 attributes: {
//                                     startOffset: index % 3 ? '75%' : index % 2 ? '22%' : '28%',
//                                     dx: index % 2 ? '-2%' : '0%',
//                                     dy: index % 3 ? '2.8%' : '3.3%'
//                                 }
//                             }
//                         },
//                         x: index + 1,
//                         y: 1.5
//                     })),
//                     xAxis: 2,
//                     yAxis: 2,
//                     borderRadius: 50,
//                     pointWidth: 1.2,
//                     pointPlacement: 'between',
//                     enableMouseTracking: false,
//                     animation: false,
//                     color: isDarkMode ? '#2CAFFE' : '#3A86FF',
//                 },
//                 {
//                     type: 'columnrange',
//                     name: 'Total',
//                     data: scoreData,
//                     xAxis: 1,
//                     yAxis: 1,
//                     shadow: false,
//                     borderColor: 'transparent',
//                     borderWidth: 2,
//                     pointPlacement: 'on',
//                     pointStart: 1,
//                     tooltip: {
//                         headerFormat: '<span class="team-day center">' +
//                             '<span class="large-size">' +
//                             '<b style="color:{point.color};">Week {point.week}</b></span>',
//                         pointFormat:
//                             '<span class="col-display-fieldwrap">' +
//                             '<span class="symbolSize" style="color:{point.color};">●</span> ' +
//                             '<b>Credit Total: </b><span>{point.high}</span></span>' +
//                             '<span class="col-display-fieldwrap">' +
//                             '<span class="symbolSize" style="color:{point.color};">●</span> ' +
//                             '<b>Debit Total: </b><span>{point.low}</span></span>' +
//                             '<span class="col-display-fieldwrap">' +
//                             '<span class="symbolSize" style="color:{point.color};">●</span> ' +
//                             '<b>Net Avg: </b><span>{point.avg}</span></span>' +
//                             '<span class="col-display-fieldwrap">',
//                         useHTML: true
//                     },
//                     animation: false,
//                     color: isDarkMode ? '#2CAFFE' : '#3A86FF',
//                 }
//             ]
//         }

//         // Apply the options to a new chart instance
//         Highcharts.chart('polar-container', chartOptions)
//     }, [isDarkMode])

//     return (
//         <Card className="shadow-lg border-0 bg-white dark:bg-gray-800 col-span-6">
//             <CardHeader className="pb-2 flex justify-between lg:flex-row flex-col">
//                 <div>
//                     <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-white">
//                         {/* <BarChart3 className="h-5 w-5 text-green-600" /> */}
//                         Weekly Credit vs Debit
//                     </CardTitle>
//                     <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
//                         Analyze trends across the month
//                     </CardDescription>
//                 </div>
//                 <div className="flex gap-2">
//                     <select
//                         className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-1 py-1"
//                         defaultValue="August"
//                     >
//                         {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
//                             'September', 'October', 'November', 'December'].map((month) => (
//                                 <option key={month} value={month}>{month}</option>
//                             ))}
//                     </select>

//                     <select
//                         className="bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 text-xs text-gray-800 dark:text-white rounded-md px-2 py-1"
//                         defaultValue={2025}
//                     >
//                         {[2023, 2024, 2025].map((year) => (
//                             <option key={year} value={year}>{year}</option>
//                         ))}
//                     </select>
//                 </div>
//             </CardHeader>
//             <CardContent className="pt-6 pb-4">
//                 <div id="polar-container" className="w-full h-full"></div>
//             </CardContent>
//         </Card>
//     )
// }

// export default AdvancedPolarChart