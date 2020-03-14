import React, { useEffect, useState } from 'react';
import '../dashboard.scss';
import Chart from 'chart.js'



function PortfolioGraph() {
const [slideValue, setSlideValue] = useState(25)

useEffect(() =>{
    var ctx = document.getElementById('myChart').getContext('2d');
    let gradient = ctx.createLinearGradient(0, 0, 0, 900);
    gradient.addColorStop(0, 'rgba(71,154,95,1)');   
    gradient.addColorStop(1, 'rgba(71,154,95,0)');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'],
            datasets: [{
                label: {display:false},
                data: [1000, 1500, 877,1100, 1200, 1700,1550,1231],
                fillColor:gradient,
                backgroundColor: gradient,
                borderWidth: 1
                // borderColor:'red'
            }]
        },
        options: {
            legend : {
                display:false
            },
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
   <div>
    <div style={{marginRight:'20px'}}>
            <canvas id="myChart" height="1000" width="2000"></canvas>
            {/* <canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;">
            </canvas> */}
        </div>
        <div className="sliderContainer">
            <input type="range" min="1" max="100" defaultValue={slideValue} class="slider"  id="myRange" onChange={e => setSlideValue(e.target.value)} ></input>
            
        </div>
        <span style={{color:'black', background:'red'}}>{slideValue}</span>
    </div>
  );
}

export default PortfolioGraph;