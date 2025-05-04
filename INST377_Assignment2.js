async function loadDogBreeds(dogBreed) {
    const buttonsContainer = document.getElementById('dogButtons');
    const breedInfoContainer = document.getElementById('breedInfo');
  
    const response = await fetch("https://dogapi.dog/api/v2/breeds");
    const data = await response.json();
  
    data.data.forEach(breed => {
      const button = document.createElement('button');
      button.textContent = breed.attributes.name;
      button.classList.add('dog-button'); 
  
      button.addEventListener('click', () => {
        breedInfoContainer.innerHTML = `
          <p>Name: ${breed.attributes.name}</p>
          <p>Description: ${breed.attributes.description}</p>
          <p>Min Life: ${breed.attributes.life.min}</p>
          <p>Max Life: ${breed.attributes.life.max}</p>
        `;
        breedInfoContainer.style.display = 'block';
      });
  
      buttonsContainer.appendChild(button);
    });

    if (dogBreed) {
        const selectedBreed = data.data.find((breed) => breed.attributes.name.toLowerCase().trim() == dogBreed.toLowerCase().trim());
        if (selectedBreed) {
            breedInfoContainer.innerHTML = `
            <p>Name: ${selectedBreed.attributes.name}</p>
            <p>Description: ${selectedBreed.attributes.description}</p>
            <p>Min Life: ${selectedBreed.attributes.life.min}</p>
            <p>Max Life: ${selectedBreed.attributes.life.max}</p>
          `;
          breedInfoContainer.style.display = 'block';    
        }
    }
  }

function loadQuoteAPI() {
    const quoteElement = document.getElementById('quoteId');
    fetch("https://zenquotes.io/api/quotes/")
    .then(response => response.json())
    .then(data => {
        const genQuote = data[Math.floor(Math.random() * data.length)];
        const quoteText = `"${genQuote.q}" — ${genQuote.a}`;
        quoteElement.textContent = quoteText;
        //console.log(data);
       
    });

}

function changeColor(color) {
    document.body.style.backgroundColor = color;

}

function navigatePage(page) {
    if (page === 'home') {
        window.location.href = 'INST377_Assignment2_Homepage.html';
    } else if (page === 'dogs') {
        window.location.href = 'INST377_Assignment2_DogsPage.html';
    } else if (page === 'stocks') {
        window.location.href = 'INST377_Assignment2_StocksPage.html';
    }
}

if (annyang) {
    const commands = {

        'show tps report': function () {
            const tps = document.getElementById('tpsreport');
            if (tps) {
            tps.style.transition = 'bottom 0.5s';
            tps.style.bottom = '20px';
            }
        },

        'change the color to *color': function(color) {
            console.log(color); // check what the mic picked up
            changeColor(color);
           
        },

        'say hello': function() {
            alert('Hello, how do you do?');
        },

        'navigate to *page': function (page) {
            console.log(page);
            navigatePage(page);
        },

        'look up *ticker': function (ticker) {
            console.log(ticker);
            document.getElementById('stockToGet').value = ticker.toUpperCase();
            populateChart();
        },

        'load *breed': function (breed) { // how do i keep the mic on the entire time
            console.log(breed);
            loadDogBreeds(breed);
        },

     
    };
  
    annyang.addCommands(commands);
  
    document.getElementById('start-listening').addEventListener('click', () => {
      annyang.start();
    });
    document.getElementById('stop-listening').addEventListener('click', () => {
       annyang.abort();
    });
      
}

async function loadStockTable() {
    const table = document.getElementById('stocksTable');

    stocksTable.style.display = 'none';


    const response = await fetch("https://tradestie.com/api/v1/apps/reddit?date=2022-04-03");
    const data = await response.json();
    const topFive = data.slice(0, 5);

    topFive.forEach((stock) => {
        const row = document.createElement('tr');
        const tickers = document.createElement('td');
        const link = document.createElement('a');
        link.href = `https://finance.yahoo.com/quote/${stock.tickers}`;
        link.textContent = stock.ticker;
        link.target = "_blank";
        tickers.appendChild(link);

    
        const comments = document.createElement('td');
        comments.textContent = stock.no_of_comments;
        const sentiment = document.createElement('td');
        const img = document.createElement('img');

        if (stock.sentiment === "Bullish")
        {
            img.src = "https://icons.veryicon.com/png/o/internet--web/flatten-icon/bullish.png";

        } else {
            img.src = "https://icons.veryicon.com/png/128/business/iconpack-003/bearish-2.png";
        }

        img.width = 50;
        img.alt = stock.sentiment;
        sentiment.appendChild(img);

        row.appendChild(tickers);
        row.appendChild(comments);
        row.appendChild(sentiment);

        table.appendChild(row);
    });

    stocksTable.style.display = 'table';
}


async function getData(ticker, days) {
    const t = new Date();
    const from = t.getTime() - days * 24 * 60 * 60 * 1000;  
    const today = t.getTime()
    return fetch(
        "https://api.polygon.io/v2/aggs/ticker/"+ticker.toUpperCase()+"/range/1/day/" +from +"/" +today +"?apiKey=Dau1OmxOmpny2am7VYSs0pt9DTUj5TSN"
      )
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data.results;
    });


}

let myChart;
async function populateChart(){
    const ticker = document.getElementById('stockToGet').value.toUpperCase();
    const days = parseInt(document.getElementById('timeline').value);

    const stockData = await getData(ticker, days);
    console.log(stockData);

    const time =[]
    const stockCost = []
    stockData.forEach(element => {
        time.push(new Date(element.t).toLocaleDateString())
        stockCost.push(element.c)
    });
    console.log(time);
    console.log(stockCost);

    //getting the canvas
    const ctx = document.getElementById('myChart');

    if(myChart) {
        myChart.destroy();
    }

    //creating a new chart object from the Js library
    myChart  = new Chart(ctx, {
    type: 'line', // Defining the type of chart
    data: {
        labels: time, //labels for the values
        datasets: [{
        label: `${ticker} Stock Price`,
        data: stockCost,
        borderWidth: 1
        }] // all the values to be shown
    },
    options: {
        animations: {
            tension: {
                duration: 1000,
                easing: 'linear',
                from: 1,
                to: 0,
                loop: true
            },
        },
        scales: {
        y: {
            beginAtZero: true
        }
        }
    }
    });

   
}

async function getDogImages() {
    const slider = document.getElementById('dogSlider');

    fetch("https://dog.ceo/api/breeds/image/random/10")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        data.message.forEach((img) => {
            let image = document.createElement('img');
            image.width = 500;
            image.height = 500;
            image.src = img;
            slider.appendChild(image);


        })
        simpleslider.getSlider();
        loadDogBreeds(null);
    });
}
