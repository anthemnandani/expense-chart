"use client"

import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import HighchartsMore from "highcharts/highcharts-more"
import { useEffect } from "react"

// Initialize Highcharts modules
if (typeof Highcharts === 'function') {
  HighchartsMore(Highcharts)
}

const AdvancedPolarChart = () => {
  useEffect(() => {
    // Custom data for our chart
    const teamData = [
      // Ulaanbaatar data (26 days)
      [1, 2, 120], [2, 2, 85], [3, 2, 110], [4, 2, 95], [5, 2, 105],
      [6, 2, 0], [7, 2, 0], // Weekend
      [8, 2, 130], [9, 2, 115], [10, 2, 125], [11, 2, 140], [12, 2, 135],
      [13, 2, 0], [14, 2, 0], // Weekend
      [15, 2, 150], [16, 2, 145], [17, 2, 160], [18, 2, 155], [19, 2, 165],
      [20, 2, 0], [21, 2, 0], // Weekend
      [22, 2, 170], [23, 2, 175], [24, 2, 180], [25, 2, 185], [26, 2, 190],
      
      // Sofia data (26 days)
      [1, 1, 80], [2, 1, 75], [3, 1, 85], [4, 1, 90], [5, 1, 95],
      [6, 1, 0], [7, 1, 0], // Weekend
      [8, 1, 100], [9, 1, 105], [10, 1, 110], [11, 1, 115], [12, 1, 120],
      [13, 1, 0], [14, 1, 0], // Weekend
      [15, 1, 125], [16, 1, 130], [17, 1, 135], [18, 1, 140], [19, 1, 145],
      [20, 1, 0], [21, 1, 0], // Weekend
      [22, 1, 150], [23, 1, 155], [24, 1, 160], [25, 1, 165], [26, 1, 170],
      
      // Asmara data (26 days)
      [1, 3, 150], [2, 3, 145], [3, 3, 155], [4, 3, 160], [5, 3, 165],
      [6, 3, 0], [7, 3, 0], // Weekend
      [8, 3, 170], [9, 3, 175], [10, 3, 180], [11, 3, 185], [12, 3, 190],
      [13, 3, 0], [14, 3, 0], // Weekend
      [15, 3, 195], [16, 3, 200], [17, 3, 205], [18, 3, 210], [19, 3, 215],
      [20, 3, 0], [21, 3, 0], // Weekend
      [22, 3, 220], [23, 3, 225], [24, 3, 230], [25, 3, 235], [26, 3, 240]
    ]

    const scoreData = [
      { x: 1, low: 80, high: 150, avg: 115, highscore: 180, topEarner: 'Asmara', week: 1 },
      { x: 8, low: 100, high: 170, avg: 135, highscore: 200, topEarner: 'Asmara', week: 2 },
      { x: 15, low: 125, high: 195, avg: 160, highscore: 220, topEarner: 'Asmara', week: 3 },
      { x: 22, low: 150, high: 220, avg: 185, highscore: 240, topEarner: 'Asmara', week: 4 }
    ]

    const colors = Highcharts.getOptions().colors.map((c: any) => Highcharts.color(c))
    
    const chartOptions: Highcharts.Options = {
      chart: {
        polar: true,
        height: '100%',
        backgroundColor: '#1f1836',
        events: {
          load: function () {
            const midPane = this.pane[1]
            // Custom function to set middle pane background
            ;(this as any).setMidPaneBg = function (background: any) {
              midPane.update({ background })
            }
          }
        }
      },
      title: {
        text: 'Advanced Polar Chart',
        style: {
          color: '#ffffff',
          fontSize: '18px'
        }
      },
      subtitle: {
        text: 'Sales Team<br>Performance',
        useHTML: true,
        align: 'center',
        y: 35,
        verticalAlign: 'middle',
        style: {
          fontSize: '1.4em',
          color: 'white'
        }
      },
      pane: [
        {
          size: '80%',
          innerSize: '75%',
          startAngle: 40.5,
          endAngle: 319.5,
          background: {
            borderColor: colors[4].toString(),
            backgroundColor: {
              radialGradient: [1, 0.25, 0.1],
              stops: [
                [0, '#1f1836'],
                [1, '#45445d']
              ]
            },
            innerRadius: '40%'
          }
        },
        {
          size: '55%',
          innerSize: '45%',
          startAngle: 40.5,
          endAngle: 319.5,
          background: {
            borderWidth: 0,
            backgroundColor: {
              radialGradient: [1, 0.25, 0.1],
              stops: [
                [0, '#1f1836'],
                [1, '#45445d']
              ]
            },
            outerRadius: '75%'
          }
        },
        {
          size: '100%',
          innerSize: '88%',
          startAngle: 16.5,
          endAngle: 343.5,
          background: {
            borderWidth: 1,
            borderColor: colors[4].toString(),
            backgroundColor: '#46465C',
            innerRadius: '55%',
            outerRadius: '100%'
          }
        }
      ],
      xAxis: [
        {
          pane: 0,
          tickInterval: 1,
          lineWidth: 0,
          gridLineWidth: 0,
          min: 1,
          max: 26,
          labels: { enabled: false }
        },
        {
          pane: 1,
          linkedTo: 0,
          gridLineWidth: 0,
          lineWidth: 0,
          plotBands: Array(3).fill(7).map((weekendOffset, week) => {
            const from = weekendOffset * (week + 1)
            const to = from - 1
            return { from, to, color: '#BBBAC5' }
          }),
          min: 0,
          max: 26,
          labels: { enabled: false }
        },
        {
          pane: 2,
          tickAmount: 4,
          tickInterval: 0.5,
          gridLineWidth: 0,
          lineWidth: 0,
          min: 1,
          max: 5,
          labels: { enabled: false }
        }
      ],
      yAxis: [
        {
          pane: 0,
          gridLineWidth: 0.5,
          gridLineDashStyle: 'longdash',
          tickInterval: 1,
          title: null,
          labels: { enabled: false },
          min: 1,
          max: 3
        },
        {
          pane: 1,
          reversed: true,
          gridLineWidth: 0,
          tickInterval: 100,
          min: 0,
          max: 400,
          title: null,
          labels: { enabled: false }
        },
        {
          pane: 2,
          tickInterval: 0.25,
          gridLineWidth: 0,
          gridLineColor: colors[1].brighten(0.05).toString(),
          min: -3,
          max: 1,
          title: null,
          labels: { enabled: false }
        }
      ],
      legend: {
        enabled: true,
        floating: true,
        layout: 'vertical',
        verticalAlign: 'center',
        align: 'center',
        backgroundColor: '#1f1836',
        borderRadius: 14,
        borderColor: 'transparent',
        borderWidth: 0,
        itemStyle: {
          color: '#FFF',
          fontSize: '0.8em'
        },
        itemHoverStyle: {
          color: '#BBBAC5',
          fontSize: '0.9em'
        }
      },
      series: [
        // Team series (bubbles)
        {
          type: 'bubble',
          name: 'Ulaanbaatar',
          data: teamData.slice(0, 26),
          color: colors[9 % colors.length].tweenTo(colors[0], 0.25).toString(),
          marker: {
            fillColor: colors[9 % colors.length].tweenTo(colors[0], 0.25).toString(),
            lineColor: '#46465C',
            lineWidth: 2
          },
          shadow: true,
          maxSize: '4%',
          minSize: '1%',
          clip: false,
          tooltip: {
            headerFormat: '<div class="team-day center">' +
              '<span class="team-header">' +
              '<b class="team-index">Day {point.x}</b></span>' +
              '<span class="team-name" style="border: 0 outset {series.color};">' +
              '<b>{series.name}</b></span>',
            pointFormat: '<span class="team-points">' +
              '<span class="team-salescount-header">Daily Sales:</span>' +
              '</br>' +
              '<span class="team-salescount">{point.z}</span>',
            footerFormat: '</div>',
            useHTML: true
          }
        },
        {
          type: 'bubble',
          name: 'Sofia',
          data: teamData.slice(26, 52),
          color: colors[9 % colors.length].tweenTo(colors[8 % colors.length], 0.65).toString(),
          marker: {
            fillColor: colors[9 % colors.length].tweenTo(colors[8 % colors.length], 0.65).toString(),
            lineColor: '#46465C',
            lineWidth: 2
          },
          shadow: true,
          maxSize: '4%',
          minSize: '1%',
          clip: false,
          tooltip: {
            headerFormat: '<div class="team-day center">' +
              '<span class="team-header">' +
              '<b class="team-index">Day {point.x}</b></span>' +
              '<span class="team-name" style="border: 0 outset {series.color};">' +
              '<b>{series.name}</b></span>',
            pointFormat: '<span class="team-points">' +
              '<span class="team-salescount-header">Daily Sales:</span>' +
              '</br>' +
              '<span class="team-salescount">{point.z}</span>',
            footerFormat: '</div>',
            useHTML: true
          }
        },
        {
          type: 'bubble',
          name: 'Asmara',
          data: teamData.slice(52, 78),
          color: colors[9 % colors.length].tweenTo(colors[3], 0.85).toString(),
          marker: {
            fillColor: colors[9 % colors.length].tweenTo(colors[3], 0.85).toString(),
            lineColor: '#46465C',
            lineWidth: 2
          },
          shadow: true,
          maxSize: '4%',
          minSize: '1%',
          clip: false,
          tooltip: {
            headerFormat: '<div class="team-day center">' +
              '<span class="team-header">' +
              '<b class="team-index">Day {point.x}</b></span>' +
              '<span class="team-name" style="border: 0 outset {series.color};">' +
              '<b>{series.name}</b></span>',
            pointFormat: '<span class="team-points">' +
              '<span class="team-salescount-header">Daily Sales:</span>' +
              '</br>' +
              '<span class="team-salescount">{point.z}</span>',
            footerFormat: '</div>',
            useHTML: true
          }
        },
        // Week labels
        {
          type: 'column',
          name: 'Month',
          data: Array(4).fill(0).map((_, index) => ({
            dataLabels: {
              format: 'Week {x}',
              enabled: true,
              inside: true,
              style: {
                textOutline: 'none',
                fontSize: '0.7em',
                fontWeight: '700',
                textTransform: 'uppercase'
              },
              textPath: {
                enabled: true,
                attributes: {
                  startOffset: index % 3 ? '75%' : index % 2 ? '22%' : '28%',
                  dx: index % 2 ? '-2%' : '0%',
                  dy: index % 3 ? '2.8%' : '3.3%'
                }
              }
            },
            x: index + 1,
            y: 1.5
          })),
          xAxis: 2,
          yAxis: 2,
          borderRadius: 50,
          pointWidth: 1.2,
          pointPlacement: 'between',
          enableMouseTracking: false,
          animation: false
        },
        // Score data (columnrange)
        {
          type: 'columnrange',
          name: 'Total',
          data: scoreData,
          xAxis: 1,
          yAxis: 1,
          shadow: false,
          borderColor: '#46465C',
          borderWidth: 2,
          pointPlacement: 'on',
          pointStart: 1,
          tooltip: {
            headerFormat: '<span class="team-day center">' +
              '<span class="large-size">' +
              '<b style="color:{point.color};">Day {point.x}</b></span>',
            pointFormat: '<span class="col-display-fieldwrap">' +
              '<span class="symbolSize" style="color:{point.color};">●</span> ' +
              '<b>Sales: </b><span>{point.high}</span></span>' +
              '<span class="col-display-fieldwrap">' +
              '<span class="symbolSize" style="color:{point.color};">●</span> ' +
              '<b>Average: </b><span>{point.avg}</span></span>' +
              '<span class="col-display-fieldwrap">' +
              '<span class="symbolSize" style="color:{point.color};">●</span> ' +
              '<b>Highscore: </b><span>{point.highscore}</span></span>' +
              '<span class="col-display-fieldwrap">' +
              '<span class="symbolSize" style="color:{point.color};">●</span> ' +
              '<b>Top earner: </b><span>{point.topEarner}</span></span>',
            footerFormat: '<i class="col-display-footer center">' +
              'Week {point.week}</i></span></span>',
            useHTML: true
          },
          animation: false
        }
      ]
    }

    // Apply the options to a new chart instance
    Highcharts.chart('polar-container', chartOptions)
  }, [])

  return (
    <div className="w-full h-[500px] p-4 bg-[#1f1836] rounded-lg col-span-3">
      {/* <div id="polar-container" className="w-full h-fit"></div> */}
    </div>
  )
}

export default AdvancedPolarChart



// const weeklyData = [
//   { weekStartDate: "01/01/2025", weekEndDate: "07/01/2025", totalDebit: 1153, totalCredit: 3000 },
//   { weekStartDate: "08/01/2025", weekEndDate: "14/01/2025", totalDebit: 0, totalCredit: 0 },
//   { weekStartDate: "15/01/2025", weekEndDate: "21/01/2025", totalDebit: 580, totalCredit: 0 },
//   { weekStartDate: "22/01/2025", weekEndDate: "28/01/2025", totalDebit: 760, totalCredit: 1200 },
//   { weekStartDate: "29/01/2025", weekEndDate: "04/02/2025", totalDebit: 230, totalCredit: 300 },
//   { weekStartDate: "05/02/2025", weekEndDate: "11/02/2025", totalDebit: 800, totalCredit: 0 },
//   { weekStartDate: "12/02/2025", weekEndDate: "18/02/2025", totalDebit: 0, totalCredit: 1000 },
//   { weekStartDate: "19/02/2025", weekEndDate: "25/02/2025", totalDebit: 1400, totalCredit: 900 },
//   { weekStartDate: "26/02/2025", weekEndDate: "04/03/2025", totalDebit: 0, totalCredit: 500 },
//   { weekStartDate: "05/03/2025", weekEndDate: "11/03/2025", totalDebit: 560, totalCredit: 0 },
//   { weekStartDate: "12/03/2025", weekEndDate: "18/03/2025", totalDebit: 340, totalCredit: 400 },
//   { weekStartDate: "19/03/2025", weekEndDate: "25/03/2025", totalDebit: 0, totalCredit: 600 },
//   { weekStartDate: "26/03/2025", weekEndDate: "01/04/2025", totalDebit: 930, totalCredit: 0 },
//   { weekStartDate: "02/04/2025", weekEndDate: "08/04/2025", totalDebit: 870, totalCredit: 1200 },
//   { weekStartDate: "09/04/2025", weekEndDate: "15/04/2025", totalDebit: 500, totalCredit: 0 },
//   { weekStartDate: "16/04/2025", weekEndDate: "22/04/2025", totalDebit: 690, totalCredit: 1000 },
//   { weekStartDate: "23/04/2025", weekEndDate: "29/04/2025", totalDebit: 770, totalCredit: 0 },
//   { weekStartDate: "30/04/2025", weekEndDate: "06/05/2025", totalDebit: 0, totalCredit: 500 },
//   { weekStartDate: "07/05/2025", weekEndDate: "13/05/2025", totalDebit: 880, totalCredit: 900 },
//   { weekStartDate: "14/05/2025", weekEndDate: "20/05/2025", totalDebit: 760, totalCredit: 600 },
//   { weekStartDate: "21/05/2025", weekEndDate: "27/05/2025", totalDebit: 0, totalCredit: 0 },
//   { weekStartDate: "28/05/2025", weekEndDate: "03/06/2025", totalDebit: 220, totalCredit: 1500 },
//   { weekStartDate: "04/06/2025", weekEndDate: "10/06/2025", totalDebit: 900, totalCredit: 400 },
//   { weekStartDate: "11/06/2025", weekEndDate: "17/06/2025", totalDebit: 620, totalCredit: 0 },
//   { weekStartDate: "18/06/2025", weekEndDate: "24/06/2025", totalDebit: 0, totalCredit: 1100 },
//   { weekStartDate: "25/06/2025", weekEndDate: "01/07/2025", totalDebit: 1130, totalCredit: 0 },
//   { weekStartDate: "02/07/2025", weekEndDate: "08/07/2025", totalDebit: 800, totalCredit: 500 },
//   { weekStartDate: "09/07/2025", weekEndDate: "15/07/2025", totalDebit: 920, totalCredit: 900 },
//   { weekStartDate: "16/07/2025", weekEndDate: "22/07/2025", totalDebit: 500, totalCredit: 200 },
//   { weekStartDate: "23/07/2025", weekEndDate: "29/07/2025", totalDebit: 0, totalCredit: 300 },
//   { weekStartDate: "30/07/2025", weekEndDate: "05/08/2025", totalDebit: 1040, totalCredit: 0 },
//   { weekStartDate: "06/08/2025", weekEndDate: "12/08/2025", totalDebit: 650, totalCredit: 700 },
//   { weekStartDate: "13/08/2025", weekEndDate: "19/08/2025", totalDebit: 300, totalCredit: 0 },
//   { weekStartDate: "20/08/2025", weekEndDate: "26/08/2025", totalDebit: 900, totalCredit: 1200 },
//   { weekStartDate: "27/08/2025", weekEndDate: "02/09/2025", totalDebit: 0, totalCredit: 0 },
//   { weekStartDate: "03/09/2025", weekEndDate: "09/09/2025", totalDebit: 1100, totalCredit: 400 },
//   { weekStartDate: "10/09/2025", weekEndDate: "16/09/2025", totalDebit: 550, totalCredit: 800 },
//   { weekStartDate: "17/09/2025", weekEndDate: "23/09/2025", totalDebit: 300, totalCredit: 0 },
//   { weekStartDate: "24/09/2025", weekEndDate: "30/09/2025", totalDebit: 0, totalCredit: 900 },
//   { weekStartDate: "01/10/2025", weekEndDate: "07/10/2025", totalDebit: 1000, totalCredit: 0 },
//   { weekStartDate: "08/10/2025", weekEndDate: "14/10/2025", totalDebit: 700, totalCredit: 1000 },
//   { weekStartDate: "15/10/2025", weekEndDate: "21/10/2025", totalDebit: 500, totalCredit: 0 },
//   { weekStartDate: "22/10/2025", weekEndDate: "28/10/2025", totalDebit: 750, totalCredit: 500 },
//   { weekStartDate: "29/10/2025", weekEndDate: "04/11/2025", totalDebit: 0, totalCredit: 1200 },
//   { weekStartDate: "05/11/2025", weekEndDate: "11/11/2025", totalDebit: 830, totalCredit: 0 },
//   { weekStartDate: "12/11/2025", weekEndDate: "18/11/2025", totalDebit: 420, totalCredit: 1000 },
//   { weekStartDate: "19/11/2025", weekEndDate: "25/11/2025", totalDebit: 660, totalCredit: 300 },
//   { weekStartDate: "26/11/2025", weekEndDate: "02/12/2025", totalDebit: 0, totalCredit: 0 },
//   { weekStartDate: "03/12/2025", weekEndDate: "09/12/2025", totalDebit: 990, totalCredit: 400 },
//   { weekStartDate: "10/12/2025", weekEndDate: "16/12/2025", totalDebit: 750, totalCredit: 100 },
//   { weekStartDate: "17/12/2025", weekEndDate: "23/12/2025", totalDebit: 300, totalCredit: 0 },
//   { weekStartDate: "24/12/2025", weekEndDate: "30/12/2025", totalDebit: 800, totalCredit: 600 },
//   { weekStartDate: "31/12/2025", weekEndDate: "06/01/2026", totalDebit: 0, totalCredit: 0 }
// ];