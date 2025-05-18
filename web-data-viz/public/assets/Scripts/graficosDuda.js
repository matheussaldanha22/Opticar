 var options = {
        series: [
        {
          name: "Alertas em Aberto",
        //   data: alertasEmAberto,
          color: "#22B4D1",
        },
        {
          name: "Alertas em Andamento",
        //   data: alertasEmAndamento,
          color: "#04708D",
        },
      ],
          chart: {
          type: 'bar',
          height: 350,
          stacked: true,
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        dataLabels: {
          formatter: (val) => {
            return val / 1000 + 'K'
          }
        },
        plotOptions: {
          bar: {
            horizontal: false
          }
        },
        xaxis: {
          categories: [
            'Madrugada',
            'Manhã',
            'Tarde',
            'Noite'
          ]
        },
        fill: {
          opacity: 1
        },
        colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
        yaxis: {
          labels: {
            formatter: (val) => {
              return val / 1000 + 'K'
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        }
        };

        var chart = new ApexCharts(document.querySelector("#chart"), options);
        chart.render();