let chart = document.getElementById("myChart");
const data = JSON.parse(document.getElementById("data").innerText);
console.log(data)

chart = new Chart('myChart', {
    type: 'line',
    data: {
        labels: data.x,
        datasets: [
            {
                backgroundColor: 'rgba(255,0,0,0.5)',
                borderColor: 'rgba(0,0,0,0.1)',
                data: data.y,
            },
        ],
    },
})


