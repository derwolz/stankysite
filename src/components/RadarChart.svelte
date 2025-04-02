<!-- RadarChart.svelte -->
<script>
import { onMount } from 'svelte';
import Chart from 'chart.js/auto';

// Props for customization
export let stats = [80, 60, 70, 55, 90]; // Default values
export let maxValue = 100; // Maximum value for the scale
export let width = '400px';
export let height = '400px';

let canvas;
let chart;

const labels = ['Intelligence', 'Strength', 'Speed', 'Defense', 'Luck'];

onMount(() => {
	const ctx = canvas.getContext('2d');

	chart = new Chart(ctx, {
		type: 'radar',
		data: {
			labels: labels,
			datasets: [{
				label: 'Character Stats',
				data: stats,
				fill: true,
				backgroundColor: 'rgba(54, 162, 235, 0.1)',
				borderColor: 'rgb(54, 162, 235)',
				pointBackgroundColor: 'rgb(54, 162, 235)',
				pointBorderColor: '#fff',
				pointHoverBackgroundColor: '#fff',
				pointHoverBorderColor: 'rgb(54, 162, 235)'
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			elements:{
				line:{
					borderWidth:3
				}
			},
			scales: {
				r: {
					angleLines: {
						display: true,
						color: 'rgb(255,255,255,0.2)'
					},
					suggestedMin: 0,
					suggestedMax: maxValue,

					ticks: {
						display: false
					},
				grid : {
					color: 'rgb(255,255,255,0.2)',
					display: true
				}

				},
			},
			plugins: {
				legend: {
					labels: {
						font:{
							family: "var(--font-tech)",
							size:14
						}
					},
					position: 'top',
					display:false
				}
			}
		}
	});

	// Cleanup on component destroy
	return () => {
		if (chart) {
			chart.destroy();
		}
	};
});

// Update chart when dataValues changes
$: if (chart && dataValues) {
	chart.data.datasets[0].data = dataValues;
	chart.update();
}
</script>

<div class="chart-container" style="width: {width}; height: {height};">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
.chart-container {
	position: relative;

	font-family: var(--font-tech);
	margin: auto;
}
</style>
