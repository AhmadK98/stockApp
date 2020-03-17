import React, { useEffect, useState } from 'react';
import '../dashboard.scss';
import Chart from 'chart.js'

const daysToList = (days) =>{
    const dateList = []
    for (let i=0; i<days; i++){  
        if (days < 10) { 
            let date = new Date(Date.now()- i*3600000)
            if (date.getDay() != 0 && date.getDay() != 6){
                dateList.push(date.toISOString().split('T')[1])
                // .split('-').slice(1,3).reverse().join('/'))
            }
        }else{
            let date = new Date(Date.now()- i*86400000)
            if (date.getDay() != 0 && date.getDay() != 6){
                dateList.push(date.toISOString().split('T')[0].split('-').slice(1,3).reverse().join('/'))
            }
        }
        

    }
     return dateList.reverse()
}

const createGraph = (data) => {
var ctx = document.getElementById('myChart').getContext('2d');
let gradient = ctx.createLinearGradient(0, 0, 0, 900);
gradient.addColorStop(0, 'rgba(71,154,95,1)');   
gradient.addColorStop(1, 'rgba(71,154,95,0)');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: daysToList(data.length),
        datasets: [{
            label: {display:false},
            data: data,
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
            }],
            xAxes: [{
                ticks: {
                    maxTicksLimit: 10
                }
            }]
        }
    }
});
// myChart.destroy()
}


function PortfolioGraph() {
    
    const [slideValue, setSlideValue] = useState(2)
    // const [date, setDate] = useState(new Date())

    // a = new Date(Date.now()-100000000).toISOString().split('T')[0]

    const createArray = (len) => {
        let array = []
        for (let i = 0; i<len;i++) {
            array.push(Math.random()*1000)
        }
        return array
    }
    
    useEffect(() =>{
        createGraph(createArray(slideValue))
        
   
    },[slideValue])

    const btnSlideValue = (timeFrame) => {
        setSlideValue(timeFrame)
    }
    
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
            <div className="selectRange">
                    <button onClick={() => setSlideValue(2)}>1d</button>
                    <button onClick={() => setSlideValue(8)}>1w</button>
                    <button onClick={() => setSlideValue(31)}>1m</button>
                    <button onClick={() => setSlideValue(366)}>1y</button>
                    <button onClick={() => setSlideValue(366*5)}>5y</button>
            </div>
            <span style={{color:'black', background:'red'}}>{slideValue}</span>
        </div>
    );
}

export default PortfolioGraph;