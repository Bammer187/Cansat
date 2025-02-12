import type { ChartData, ChartOptions } from 'chart.js';

export const data: ChartData<'line'> = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Testing Data',
      backgroundColor: '#f87979',
      borderColor: '#f87979',
      pointBackgroundColor: '#f87979',
      data: [40, 39, 10, 40, 39, 80, Math.floor(Math.random() * 100)],
    },
  ],
};

export const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
};