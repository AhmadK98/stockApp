import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "../dashboard.scss";
import Chart from "chart.js";
// import * as ChartAnnotation from "chartjs-plugin-annotation";
import { setStockData } from "../../../actions";

const getWeek = (date) => {
	let firstDay = new Date(date.getFullYear(), 0, 1);
	// console.log(firstDay);
	let week = Math.ceil(Math.ceil(date - firstDay + 86400000) / (1000 * 86400 * 7));
	return week;
};

const findDates = (dateArray, referenceDate) => {
	/*
        Going backwards, returns index of first date that is less than reference date
    */
	if (typeof referenceDate != Date) {
		referenceDate = new Date(referenceDate);
	}

	let index = dateArray.findIndex((date) => {
		// console.log(date, referenceDate);
		return new Date(date) <= referenceDate;
	});
	return index;
};

Chart.Tooltip.positioners.custom = function (elements, position, tooltip) {
	if (!elements.length) {
		return false;
	}
	// console.log(elements)
	var offset = 0;
	//adjust the offset left or right depending on the event position
	if (elements[0]._chart.width / 2 > position.x) {
		offset = -20;
	} else {
		offset = -20;
	}
	return {
		x: position.x + offset,
		y: 10,
	};
};

Chart.plugins.register({
	afterDatasetsDraw: function (chart) {
		if (chart.tooltip._active && chart.tooltip._active.length) {
			var activePoint = chart.tooltip._active[0],
				ctx = chart.ctx,
				y_axis = chart.scales["y-axis-0"],
				x = activePoint.tooltipPosition().x,
				topY = y_axis.top,
				bottomY = y_axis.bottom;
			// draw line
			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x, topY);
			ctx.lineTo(x, bottomY);
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#9E9E9E";
			ctx.setLineDash([2, 4]);
			ctx.stroke();
			ctx.restore();
		}
	},
});

const getXDate = (range, country) => {
	/* 
		Returns target date for selected date, this will be the filter 
		for the array called by the /stocks/history endpoint.

	*/

	let currentDate = new Date();
	currentDate.setSeconds(0);
	currentDate.setMilliseconds(0);

	let dateAddition;
	if (currentDate.getHours() <= 14 && currentDate.getDay() == 1) {
		dateAddition = 3;
	} else if (currentDate.getDay() == 0) {
		// console.log('g')
		dateAddition = 2;
	} else if (currentDate.getHours() <= 14 || currentDate.getDay() == 6) {
		dateAddition = 1;
	} else {
		dateAddition = 0;
	}

	switch (range) {
		case "1d":
			currentDate.setDate(currentDate.getDate() - (1 + dateAddition));

			if (country == "UK") {
				currentDate.setHours(9);
				currentDate.setMinutes(0);
			} else {
				currentDate.setHours(21);
				currentDate.setMinutes(0);
			}
			break;
		case "5d":
			currentDate.setDate(currentDate.getDate() - (5 + dateAddition - 1));
			currentDate.setHours(14);
			currentDate.setMinutes(28);
			break;
		case "1m":
			currentDate.setDate(currentDate.getDate() - 30);
			currentDate.setHours(14);
			currentDate.setMinutes(28);
			break;
		case "ytd":
			currentDate.setDate(1);
			currentDate.setMonth(0);
			while (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
				currentDate.setDate(currentDate.getDate() + 1);
			}
			currentDate.setHours(14);
			currentDate.setMinutes(28);
			break;
		case "1y":
			currentDate.setFullYear(currentDate.getFullYear() - 1);
			currentDate.setHours(14);
			currentDate.setMinutes(28);
			break;
		case "5y":
			currentDate.setFullYear(currentDate.getFullYear() - 5);
			currentDate.setHours(14);
			currentDate.setMinutes(28);
			break;
		case "max":
			currentDate.setFullYear(currentDate.getFullYear() - 100);
			currentDate.setHours(14);
			currentDate.setMinutes(28);
			break;
	}

	while (currentDate.getDay() == 0 || currentDate.getDay() == 6) {
		// console.log(currentDate.getDay())
		currentDate.setDate(currentDate.getDate() - 1);
		// console.log(currentDate.getDay());
	}

	return currentDate.toISOString();
};

const getXtickers = (range, newDate) => {
	let xOptions = {};
	switch (range) {
		case "1d":
			xOptions = {
				// parser: "HH:MM",
				unit: "minute",
				source: "data",
				stepSize: 1.1,
				displayFormats: {
					minute: "HH:mm",
					hour: "HH:mm",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 6];

		case "5d":
			xOptions = {
				unit: "day",
				source: "data",
				stepSize: 9,
				displayFormats: {
					day: "DD MMM",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 3];

		case "1m":
			xOptions = {
				unit: "day",
				source: "data",
				stepSize: 1.1,
				displayFormats: {
					day: "DD MMM",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 6];

		case "ytd":
			xOptions = {
				unit: "month",
				source: "data",
				stepSize: 1.1,
				displayFormats: {
					month: "MMM YYYY",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 2];

		case "1y":
			xOptions = {
				unit: "month",
				source: "data",
				stepSize: 1,
				displayFormats: {
					hour: "MMM YYYY",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 6];

		case "5y":
			xOptions = {
				unit: "year",
				source: "data",
				stepSize: 1,
				displayFormats: {
					// year: "YYYY",
					hour: "YYYY",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 5];

		case "max":
			xOptions = {
				unit: "year",
				source: "data",
				stepSize: 1.5,
				displayFormats: {
					year: "YYYY",
				},
				// min: newDate[newDate.length - 1],
				// max: newDate[1],
			};
			return [xOptions, 7];
	}
};

const createGraph = (data, timeData, range) => {
	// granularity = {'5d','1m','ytd','1y','5y','max'}
	let dataObject = {};
	if (data) {
		// console.log(data);
		for (let i = 0; i < data.length; i++) {
			dataObject[timeData[i]] = data[i];
		}
	}

	let dateArray = {};
	let previous = 0;

	let newPrice = [];
	let newDate = [];

	// console.log(dataObject);
	Object.keys(dataObject).map((date) => {
		let dateObject = new Date(date);
		// console.log(getWeek(date));
		let year = dateObject.getFullYear();
		let month = dateObject.getMonth();
		let week = getWeek(dateObject);
		let dateDate = dateObject.getDate();
		let day = dateObject.getDay();

		// console.log(newDate)
		if (day != 0 && day != 6) {
			if (!(year in dateArray)) {
				dateArray[dateObject.getFullYear()] = [];
			}

			if (!(month in dateArray[year])) {
				dateArray[year][month] = [];
			} else if (range == "5y" || range == "max") {
				return;
			}
			if (!(week in dateArray[year][month])) {
				dateArray[year][month][week] = [];
			}

			if (!(dateDate in dateArray[year][month][week])) {
				dateArray[year][month][week][dateDate] = {};
			}

			if (range == "1d") {
				dateArray[year][month][week][dateDate][date] = dataObject[date];
				newDate.push(dateObject.getTime());
				newPrice.push(Number(dataObject[date]).toFixed(4));
			} else if (range == "5d") {
				if (
					dateObject.getTime() == new Date(Object.keys(dataObject)[0]).getTime() ||
					dateObject.getTime() == new Date(Object.keys(dataObject)[dataObject.length - 1]).getTime()
				) {
					newDate.push(dateObject.getTime() / 1);
					newPrice.push(Number(dataObject[date]).toFixed(4));
				}
				if (previous == 0) {
					dateArray[year][month][week][dateDate][date] = dataObject[date];
					previous = dateObject.getTime();
					// newDate.push(dateObject.getTime() / 1);
					// newPrice.push(dataObject[date]);
				} else {
					if (previous - dateObject.getTime() >= 600000) {
						// console.log(date);
						dateArray[year][month][week][dateDate][date] = dataObject[date];
						previous = 0;
						newDate.push(dateObject.getTime() / 1);
						newPrice.push(Number(dataObject[date]).toFixed(4));
					} else {
						return;
					}
				}
			} else {
				if (Object.keys(dateArray[year][month][week][dateDate]).length == 0) {
					dateArray[year][month][week][dateDate][date] = dataObject[date];

					newDate.push(dateObject.getTime() / 1);
					newPrice.push(dataObject[date]);
				}
			}
		}
	});
	// console.log(newDate, newPrice);
	// console.log(newDate);
	// console.log()
	let prevClose;
	if (range == "1d") {
		newDate = newDate.slice(0, newDate.length - 1);
		prevClose = newPrice[newPrice.length - 1];
		newPrice = newPrice.slice(0, newDate.length);
		// console.log(newPrice, newDate)
	} else {
		prevClose = newPrice[newPrice.length - 1];
	}
	// console.log(newDate);

	const graphExpansion = (priceArray) => {
		let stepSize = 2;
		let min = Math.min(...priceArray);
		let max = Math.max(...priceArray);

		return [stepSize];
	};

	var ctx = document.getElementById("myChart").getContext("2d");
	let gradient = ctx.createLinearGradient(0, 0, 0, 700);
	let lineColour;
	if (newPrice[0] - prevClose > 0) {
		gradient.addColorStop(0, "rgb(177,223,201,0.5)");
		gradient.addColorStop(0.5, "rgba(177,223,201,0.0)");
		gradient.addColorStop(1, "rgba(177,223,201,0.1)");
		lineColour = "#0F9D58";
	} else {
		// console.log("g");
		gradient.addColorStop(0, "rgb(249,190,204,0.5)");
		gradient.addColorStop(0.5, "rgba(249,190,204,0.0)");
		gradient.addColorStop(1, "rgba(249,190,204,0.1)");
		lineColour = "#E64919";
	}

	let [min, max] = graphExpansion(newPrice);

	let xOptions = getXtickers(range, newDate);

	window.myChart = new Chart(ctx, {
		type: "line",

		data: {
			labels: newDate,
			spanGaps: false,
			datasets: [
				{
					data: newPrice,
					fillColor: gradient,
					backgroundColor: gradient,
					borderWidth: 2,
					border: false,
					borderColor: lineColour,
					// borderDash: [5, 5],
					// backgroundColor: "black",
					pointBackgroundColor: "yellow",
					pointBorderColor: "yellow",
					pointHoverBackgroundColor: "yellow",
					pointHoverBorderColor: "#55bae7",
					tension: 0,

					// borderColor: "red",
				},
			],
		},
		onHover: function () {
			console.log("g");
			// The annotation is is bound to the `this` variable
			// console.log("Annotation", e.type, this);
		},
		options: {
			layout: {
				padding: {
					// top:100,
					// bottom:30,
				},
			},
			animation: {
				duration: 500,
			},

			// onHover: function (e) {
			// 	console.log(window.myChart.tooltip);
			// 	// The annotation is is bound to the `this` variable
			// 	// console.log("Annotation", e.type, this);
			// },
			elements: {
				point: {
					radius: 0,
					hoverRadius: 0,
					pointStyle: "none",
				},
			},
			responsive: true,
			hover: {
				mode: "index",
				intersect: false,
			},

			annotation: {
				display: false,
				events: ["click", "mousemove"],
				annotations: [
					{
						drawTime: "beforeDatasetsDraw",
						id: "hline",
						type: range == "1d" ? "line" : "g",
						mode: "horizontal",
						scaleID: "y-axis-0",
						value: prevClose,
						borderColor: "black",
						borderDash: [1, 9],
						borderWidth: 1,
						label: {
							// backgroundColor: "red",
							position: "top",
							content: `Prev Close ${prevClose}`,
							enabled: true,

							background: {
								enabled: false,
							},
						},
						onHover: function (e) {
							console.log("g");
							// The annotation is is bound to the `this` variable
							// console.log("Annotation", e.type, this);
						},
					},
					// {
					// 	drawTime: "beforeDatasetsDraw",
					// 	id: "vline1",
					// 	type: range == "1d" ? "line" : "g",
					// 	mode: "vertical",
					// 	scaleID: "x-axis-0",
					// 	value: 1595007960000,
					// 	borderColor: "red",
					// 	borderDash: [10, 10],
					// 	borderWidth: 1,
					// 	// position:399,
					// 	label: {
					// 		// backgroundColor: "red",
					// 		// position: 500,
					// 		content: `Prev Close ${prevClose}`,
					// 		enabled: false,

					// 		background: {
					// 			enabled: false,
					// 		},
					// 	},
					// 	onMouseMove: function (e) {
					// 		console.log(window.myChart);
					// 		// The annotation is is bound to the `this` variable
					// 		// console.log("Annotation", e.type, this);
					// 	},
					// },
				],
			},

			tooltips: {
				enabled: false,
				position: "custom",
				mode: "index",
				intersect: false,
				callbacks: {
					labelColor: function (tooltipItem, chart) {
						return {
							borderColor: "rgb(255, 0, 0)",
							backgroundColor: "red",
							label: "g",
							value: "hi",
						};
					},
				},
				custom: function (tooltipModel) {
					// Tooltip Element
					var tooltipEl = document.getElementById("chartjs-tooltip");

					// Create element on first render
					if (!tooltipEl) {
						tooltipEl = document.createElement("div");
						tooltipEl.id = "chartjs-tooltip";
						tooltipEl.innerHTML = "<table></table>";
						document.body.appendChild(tooltipEl);
					}

					// Hide if no tooltip
					if (tooltipModel.opacity === 0) {
						tooltipEl.style.opacity = 0;
						return;
					}

					// Set caret Position
					tooltipEl.classList.remove("above", "below", "no-transform");
					if (tooltipModel.yAlign) {
						// tooltipEl.classList.add(tooltipModel.yAlign);
					} else {
						// tooltipEl.classList.add("no-transform");
					}

					function getBody(bodyItem) {
						return bodyItem.lines;
					}

					// Set Text
					if (tooltipModel.body) {
						tooltipEl.style.background = "white";
						var titleLines = [];
						var bodyLines = tooltipModel.body.map(getBody);

						// var innerHtml = "";

						// innerHtml += "<tr><td>" + tooltipModel.title + "</th></td>";

						// innerHtml += "<tbody>";

						// // bodyLines.forEach(function (body, i) {
						// // 	var colors = tooltipModel.labelColors[i];
						// // 	var style = "background:" + colors.backgroundColor;
						// // 	style += "; border-color:" + colors.borderColor;
						// // 	// style += "; border-width: 10px";
						// // 	var span = '<span style="' + style + '"></span>';
						// // 	innerHtml += "<tr><td>" + span + body + "</td></tr>";
						// // });
						// innerHtml += "</tbody>";
						// console.log(bodyLines)
						let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
						let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
						let dateTitle = new Date(tooltipModel.title);
						let day = days[dateTitle.getDay()]
						let date = dateTitle.getDate();
						let month = months[dateTitle.getMonth()]
						let year = dateTitle.getFullYear()

						switch (range) {
							case "1d":
							case "5d":
								let minutes = dateTitle.getMinutes();
								let hours = dateTitle.getHours();
								if (range == "1d") {
									tooltipModel.title = `${hours}:${minutes} ${bodyLines[0]}`;
								} else {
									
									tooltipModel.title = `${day}, ${date} ${month} ${hours}:${minutes}`;
								}

								break;
							case "5d":
								console.log(tooltipModel.title());
								break;
							case "1m":
							case "ytd":
								break;
							case "1y":
							case "5y":
							case "max":
								break;
						}
						let innerHtml = `<div white-space=nowrap>
										<span>
											${tooltipModel.title} 
										</span>
									</div>`;

						// let dateTitle =  new Date(titleLines[0])
						// let dateTitleMinute = dateTitle.getMinutes() < 10 ? `0${dateTitle.getMinutes()}`:dateTitle.getMinutes()

						// innerHtml = dateTitle

						var tableRoot = tooltipEl.querySelector("table");

						tableRoot.innerHTML = innerHtml;
					}

					// `this` will be the overall tooltip
					var position = this._chart.canvas.getBoundingClientRect();

					// Display, position, and set styles for font
					tooltipEl.style.opacity = 1;
					tooltipEl.style.position = "absolute";
					tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + -33 + "px";
					tooltipEl.style.right = position.right + window.pageXOffset + tooltipModel.caretX + "px";
					tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + "px";
					tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
					tooltipEl.style.fontSize = tooltipModel.bodyFontSize + "px";
					tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
					tooltipEl.style.padding = 0 + "px " + 50 + "px";
					// tooltipEl.style.pointerEvents = "none";
				},
			},
			legend: {
				display: false,
			},
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: false,
							// suggestedMin: 0.99 * Math.min(...newPrice),
							// suggestedMax: 1.01 * Math.max(...newPrice),
							// stepSize:0.2,
							maxTicksLimit: 5,
							major: {
								enabled: false,
							},
						},
						gridLines: {
							// drawTicks: true,
							display: true,
						},
					},
				],
				xAxes: [
					{
						type: "time",

						time: xOptions[0],

						distribution: "series",

						ticks: {
							autoSkip: true,
							source: "data",
							bounds: "data",
							major: {
								enabled: true,
							},
							precision: 0,
							maxTicksLimit: xOptions[1],

							max:15950041640000,
							// callback: function(tick, index, array) {
							// 	return (index % 10) ? "" : tick;
							// }
							maxRotation: 0,
							// drawTicks: true,
						},
						gridLines: {
							drawTicks: true,
							display: false,
						},
					},
				],
			},
		},
	});
};

function PortfolioGraph() {
	const [slideValue, setSlideValue] = useState("1d");
	const dispatch = useDispatch();
	const stockData = useSelector((state) => state.stockData);
	const selectedTicker = useSelector((state)=> state.selectedTicker)

	useEffect(() => {
		dispatch(async () => {
			let res = await fetch(`/stocks/history/${selectedTicker}`);
			let data = await res.json();
			// console.log(data);
			dispatch(setStockData(await data[0]["0"]));
			// createGraph(data[0]["0"]["price"]);
		});
	}, [selectedTicker]);

	const createArray = (len) => {
		//data here
		let array = [];
		for (let i = 0; i < len; i++) {
			array.push(Math.random() * 1000);
		}
		return array;
	};

	useEffect(() => {
		if (window.myChart.id !== "myChart") {
			window.myChart.destroy();
		}

		if (stockData != 1) {
			// console.log(stockData);
			let index = findDates(stockData["time_data"], getXDate(slideValue));
			// console.log(getXDate(slideValue))
			// console.log((stockData["price"].slice(0, index).reverse()).length)
			createGraph(stockData["price"].slice(0, index), stockData["time_data"].slice(0, index), slideValue);
			// console.log(stockData["time_data"].slice(0, index).reverse())
		}

		// window.myChart.destroy()
	}, [slideValue, stockData]);

	// const btnSlideValue = (timeFrame) => {
	//     setSlideValue(timeFrame)
	// }

	return (
		<div>
			<div style={{ marginRight: "20px" }}>
				<canvas id="myChart" height="900" width="2500"></canvas>
				{/* <canvas id="myCanvas" width="200" height="100" style="border:1px solid #000000;">
                </canvas> */}
			</div>
			{/* <div className="sliderContainer">
                <input type="range" min="1" max="100" defaultValue={slideValue} class="slider"  id="myRange" onChange={e => setSlideValue(e.target.value)} ></input>
                
            </div> */}
			<div className="selectRange">
				<button onClick={() => setSlideValue("1d")}>1d</button>
				<button onClick={() => setSlideValue("5d")}>1w</button>
				<button onClick={() => setSlideValue("1m")}>1m</button>
				<button onClick={() => setSlideValue("ytd")}>YTD</button>
				<button onClick={() => setSlideValue("1y")}>1y</button>
				<button onClick={() => setSlideValue("5y")}>5y</button>
				<button onClick={() => setSlideValue("max")}>Max</button>
			</div>
		</div>
	);
}

export default PortfolioGraph;
