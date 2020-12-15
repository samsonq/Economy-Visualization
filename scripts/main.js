// Global constants
const DEBUG = true;
const Knife_PRICE = 14.25;
const Fork_PRICE = 9.99;

// Some little helpers
const log = msg => (DEBUG ? console.log(msg) : '');
const select = id => document.getElementById(id);


function plotMap(sales) {

	var data = [
		['eu', 0],
		['oc', 1],
		['af', 2],
		['as', 3],
		['na', 4],
		['sa', 5]
	];

	// Create the chart
	Highcharts.mapChart('myMap', {
		chart: {
			map: 'custom/world-continents'
		},

		tooltip: {
			headerFormat: null,
			pointFormat: '{point.name}',
		},

		title: {
			text: null
		},

		legend: {
			enabled: false
		},

		colors: ['lightgray'],

		series: [{
			data: data,
			allowPointSelect: true,
			stickyTracking: false,

			states: {
				hover: {
					color: 'gray'
				},
				select: {
					color: 'green',
				},
			},
			events: {
				mouseOver: function (continent) {
					continent.target.update({
						states: {
							select: {
								color: '#39cc59'
							}
						}
					});
				},

				mouseOut: function (continent) {
					continent.target.update({
						states: {
							select: {
								color: '#64853a'
							}
						}
					});

				},

				click: function (continent) {
					name = continent.point.name.toUpperCase().replace(" ", "");
					if (name == 'OCEANIA') {
						name = 'AUSTRALIA';
					}

					let knifes = 0, forks = 0;
					for (const datum of sales[name]) {
						knifes += datum['Knife'];
						forks += datum['Fork'];
					}
					let revenue = Knife_PRICE * knifes + Fork_PRICE * forks;
					select('dingusSold').innerHTML = knifes;
					select('widgetSold').innerHTML = forks;
					select('totalSales').innerHTML = revenue.toFixed(2);

					plotColumn(sales[name]);
					plotSales(sales[name]);
				}
			},

			dataLabels: {
				enabled: true,
				format: '{point.name}',
				color: 'black'
			}
		}]
	});
}

function plotSales(sales) {

	knife_total = 0;
	fork_total = 0;

	for (month in sales) {
		knife_total += sales[month]['Knife'];
		fork_total += sales[month]['Fork'];
	}

	Highcharts.chart('totalSalesChart', {
		chart: {
			type: 'pie'
		},
		title: {
			text: '<b> Total Sales </b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				dataLabels: {
					enabled: true,
					format: '{point.percentage:.1f}',
					distance: -80
				},
				showInLegend: true
			}
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			borderWidth: 2,
			floating: true,
			symbolHeight: 9,
			symbolWidth: 9,
			symbolRadius: 0
		},
		tooltip: {
			pointFormat: '{point.y}',
			headerFormat: null
		},
		series: [{
			data: [{
				name: 'Knife',
				y: knife_total,
				color: '#1C7ED0'
			}, {
				name: 'Fork',
				y: fork_total,
				color: 'red'
			}]
		}]
	});
}

function plotColumn(sales) {

	knife_series = [];
	fork_series = [];

	for (month in sales) {
		knife_series.push(sales[month]['Knife']);
		fork_series.push(sales[month]['Fork']);
	}

	Highcharts.chart('salesPerMonthChart', {
		chart: {
			type: 'column'
		},
		title: {
			text: '<b> Monthly Sales </b>'
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			borderWidth: 2,
			floating: true,
			symbolHeight: 9,
			symbolWidth: 9,
			symbolRadius: 0
		},
		xAxis: {
			categories: ['January', 'February', 'March'],
			title: {
				text: '<b> Month </b> '
			}
		},
		tooltip: {
			headerFormat: null,
			pointFormat: '{point.y}'
		},
		yAxis: {
			min: 0,
			title: {
				text: '<b> Number of units sold </b>'
			}
		},
		plotOptions: {
			series: {
				groupPadding: .05,
				pointPadding: .05
			}
		},
		series: [{
			name: 'Knife',
			data: knife_series,
			color: '#1C7ED0'
		}, {
			name: 'Fork',
			data: fork_series,
			color: 'red'
		}]
	})
}

function plotPie(continent) {
	if (continent === 'ANTARCTICA') {
		zingchart.exec('totalSalesChart', 'destroy');
		return;
	}
	let knifeValues = {
		values: [],
		text: "Knife"
	}
	let forkValues = {
		values: [],
		text: "Fork"
	}
	let sales = data[continent];
	let knifes = 0, forks = 0;
	for (const datum of sales) {
		knifes += datum['Knife'];
		forks += datum['Fork'];
	}
	knifeValues['values'].push(knifes);
	forkValues['values'].push(forks);
	let myConfig = {
		type: 'pie',
		legend: {},
		title: {
			text: 'Total Sales'
		},
		series: [
			knifeValues,
			forkValues
		]
	};
	zingchart.render({
		id: 'totalSalesChart',
		data: myConfig,
		height: '100%',
		width: '100%'
	})
}

function updateScoreCards(continent) {
	let sales = data[continent];
	let knifes = 0, forks = 0;
	for (const datum of sales) {
		knifes += datum['Knife'];
		forks += datum['Fork'];
	}
	let revenue = Knife_PRICE * knifes + Fork_PRICE * forks;
	select('dingusSold').innerHTML = knifes;
	select('widgetSold').innerHTML = forks;
	select('totalSales').innerHTML = revenue.toFixed(2);
}

async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}

function plotStocks(stocks) {
	data = [];
	for (i in stocks) {
		data.push([stocks[i]['Date'], stocks[i]['Close']]);
	}

	Highcharts.chart('stockChart', {
		chart: {
			type: 'area'
		},
		title: {
			text: '<b> Dynamic Growth </b>'
		},
		subtitle: {
			text: '<b> Stock Prices of K&F Corp. from 2015-Present </b>'
		},
		xAxis: {
			type: 'datetime',
			title: {
				text: '<b> Date </b>'
			},
			labels: {
				format: '{value: %m/%e/%y}'
			},
			crosshair: {
				width: 1,
				color: 'black'
			}
		},
		yAxis: {
			title: {
				text: '<b> Adj Close Stock Price </b>'
			},
			crosshair: {
				width: 1,
				color: 'black'
			}
		},
		tooltip: {
			pointFormat: '${point.y:.2f}',
			split: true,
			shared: true
		},
		plotOptions: {
			marker: {
				symbol: 'triangle'
			}
		},
		legend: {
			enabled: false
		},
		series: [{
			data: data,
			lineColor: '#256fa1',
			color: 'lightblue',
			opacity: .7
		}]
	})

}

function init() {
	salesPromise = loadJSON('./data/sales.json');
	stocksPromise = loadJSON('./data/stocks.json');

	salesPromise.then(function (sales) {
		plotMap(sales);
	});

	stocksPromise.then(function (stocks) {
		plotStocks(stocks);
	});
}

document.addEventListener('DOMContentLoaded', init, false);
