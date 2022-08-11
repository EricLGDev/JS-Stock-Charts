function getColor(stock){
    if(stock === "GME"){
        return 'rgba(230, 0, 92)'
    }
    if(stock === "MSFT"){
        return 'rgba(81, 186, 200)'
    }
    if(stock === "DIS"){
        return 'rgba(255, 255, 0)'
    }
    if(stock === "BNTX"){
        return 'rgba(77, 255, 210)'
    }
}
async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    const response = await fetch ('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=67297517deb14cddb87eea28d8f60155');

    const result = await response.json();

    const { GME, MSFT, DIS, BNTX } = result;

    const stocks = [GME, MSFT, DIS, BNTX];

    stocks.forEach(stock => stock.values.reverse());

    // Stock Price Over Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
                data: stock.values.map(value => parseFloat(value.high))
            }))
        }
    });

    // Highest Stock Price Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'Highest',
                backgroundColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                borderColor: stocks.map(stock => (
                    getColor(stock.meta.symbol)
                )),
                data: stocks.map(stock => (
                    findHighest(stock.values)
                ))
            }]
        }
    });

    

    function findHighest(values) {
        let highest = 0;
        values.forEach(value => {
            if (parseFloat(value.high) > highest) {
                highest = value.high
            }
        })
        return highest
    }
    
    function calculateAverage(values) {
        let total = 0;
        values.forEach(value => {
            total += parseFloat(value.high)
        })
        return total / values.length
    }
}

main()