import React, { useEffect, useState } from 'react';
import '../dashboard.scss';
import Chart from 'chart.js'



function PortfolioGraph() {


useEffect(() =>{
    var ctx = document.getElementById('myChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(71,154,95,1)');   
    gradient.addColorStop(1, 'rgba(71,154,95,0)');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'],
            datasets: [{
                label: 'Portfolio Value',
                data: [1000, 1500, 877,1100, 1200, 1700,1550,1231],
                fillColor:gradient,
                backgroundColor: gradient,
                borderWidth: 1,
                // borderColor:'red'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            }
        }
    });
    },[])
    
  return (
    <div style={{marginRight:'20px'}}>
        <canvas id="myChart" height={1} width={3}></canvas>
    </div>
  );
}

export default PortfolioGraph;