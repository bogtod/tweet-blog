let feedContent = document.querySelector('#feedContent');

//loading gif controller
function showLoader(status, location) {
    if(status === 'on') {
        let loading = document.createElement('div');
        loading.classList.add('loading');
        loading.innerHTML = `
            <img src="media/Spinner-1s-200px (1).gif" />
            <span>Searching news...</span>
        `;
        location.appendChild(loading);
    } else if(status === 'off') {
        if(location.querySelector('.loading') !== null) {
            location.querySelector('.loading').remove();
        };
    };
};


//header search form
document.querySelector('.searchForm').onsubmit = function(form) {
    //prevent the form's default behaviour and show the loader
    form.preventDefault();
    showLoader('on', feedContent);

    let query = document.getElementById('searchInput');
    form.target.classList.remove('focusControl');
    getNews('everything', query.value);

    let searchControl = document.createElement('span');
    searchControl.classList.add('searchResult');
    searchControl.disabled = true;
    searchControl.innerHTML = `News related to <u>${query.value}</u>`;
    document.querySelector('#feedControl').insertAdjacentElement('afterEnd', searchControl);

    query.value = '';
    form.target.classList.add('focusControl');
    form.target.parentElement.focus();
    removeActive();
};


//function for removing the active class of the feed options (top news, sports, technology)
function removeActive() {
    let actives = document.querySelectorAll('.active');
    for(let x = 0; x < actives.length; x++) {
        actives[x].classList.remove('active');
    };
}


//getting an array of the feed options and iterating through them for adding click event listeners
let feedControls = document.querySelectorAll('#feedOptions > button');
for (let i = 0; i < feedControls.length; i++) {
    feedControls[i].addEventListener('click', function(btn) {
        //clicking on a feed option: show loading gif, call the getNews function (pass arguments), remove active class from all of the options
            //check if the search result span is present from a previous search and remove it, add active class to the clicked feed option
        showLoader('on', feedContent);
        getNews('top-headlines', '', btn.target.value);
        removeActive();
        if(document.querySelector('.searchResult') !== null) {
            document.querySelector('.searchResult').remove();
        };
        btn.target.classList.add('active');
    });
}


//function for setting the search parameters and making the http request
function getNews(apiEndpoint, query, category) {
    let apiKey = 'becd678965f34642b4df5dbba8494e67';
    let reqUrl = '';
    if(apiEndpoint === 'everything') {
        reqUrl = `https://newsapi.org/v2/${apiEndpoint}?q=${query}&apiKey=${apiKey}`;
    } else if(apiEndpoint === 'top-headlines') {
        if(category === 'top') {
            reqUrl = `https://newsapi.org/v2/${apiEndpoint}?country=us&apiKey=${apiKey}`;
        } else {
            reqUrl = `https://newsapi.org/v2/${apiEndpoint}?category=${category}&country=us&apiKey=${apiKey}`;
        };
    };
    
    request(reqUrl);
    

    //actual http request function
    function request(url) {
        //clean the feed content from previous results
        feedContent.innerHTML = '';
        let req = new XMLHttpRequest();
        // req.addEventListener('error', function(error){console.log(error)});
        req.open('GET', url);
        req.responseType = 'json';
        req.send();
        req.onload = function() {
            //call function and pass the request results
            displayArticles(req.response.articles);
            //hide the loading gif
            showLoader('off', feedContent);
        };
    };
};


//function for displaying the articles
function displayArticles(articles) {
    for(let i = 0; i < articles.length; i++) {
        //create article element for each result received and generating the content
        let listItem = document.createElement('article');
        listItem.innerHTML = `
            <span><i class="fas fa-stopwatch"></i> ${moment(new Date(articles[i].publishedAt)).fromNow()}</span>
            <div>
                <div>
                    <img src='${articles[i].urlToImage}' />
                </div>
                    
                <div>
                    <h2>${articles[i].title}</h2>
                    <hr>
                    <p>${articles[i].description}</p>
                    <a href=${articles[i].url}>Read it on ${articles[i].source.name}</a>
                </div>
            </div>
        `;
        feedContent.appendChild(listItem);
    };
};






const exchangeWrap = document.querySelector('#exchangeWrap');
let output = exchangeWrap.querySelector('#exchangeOutput');

exchangeWrap.querySelector('form').onsubmit = function(form) {
    form.preventDefault();

    let ratesArr = Array.from(this.querySelectorAll('.dropdown input:checked'));
    if(ratesArr === 0) {
        getRates('all');
    };
    getRates('', ratesArr);
    dropdown.classList.toggle('show');
};


function getRates(mode, symbols) {
    output.innerHTML = '';
    showLoader('on', exchangeWrap.querySelector('#exchangeOutput'));
    let base = document.querySelector('#base');
    let url;
    if(mode === 'all') {
        url = `https://api.exchangeratesapi.io/latest?base=${base.value}`;
    } else {
        url = `https://api.exchangeratesapi.io/latest?base=${base.value}&symbols=${symbols.map((sym) => { return sym.value }).join(',')}`;
    };

    let exchangeReq = new XMLHttpRequest();
    exchangeReq.open('GET', url);
    exchangeReq.responseType = 'json';
    exchangeReq.send();
    exchangeReq.onload = function() {
        console.log(exchangeReq.response);
        displayExchangeRates(exchangeReq.response, mode);
        dropdownBtn.querySelector('span').innerText = '';
    }
}



let ratesObj = {};
function displayExchangeRates(response, mode) {
    let updated = document.createElement('small');
    updated.innerText = `Updated: ${response.date}`;
    output.appendChild(updated);
    ratesObj = response.rates;

    for(rate in response.rates) {
        let rateElem = document.createElement('p');
        rateElem.innerHTML = `
        <input type='number' value='1' /> ${response.base} = <span>${response.rates[rate].toFixed(2)}</span> <span>${rate}</span>`;
        output.appendChild(rateElem);
    };
    
    for(let i = 0; i < output.querySelectorAll('p').length; i++) {
        output.querySelectorAll('input')[i].addEventListener('keyup', function(val) {
            val.target.parentElement.querySelectorAll('span')[0].innerText = (ratesObj[val.target.parentElement.querySelectorAll('span')[1].innerText] * val.target.value).toFixed(2);
        });
    };

    if(mode !== 'all') {
        let moreBtn = document.createElement('a');
        moreBtn.innerText = 'Show All Available Rates';
        moreBtn.addEventListener('click', function() { getRates('all') });
        output.appendChild(moreBtn);
    };

    showLoader('off', exchangeWrap.querySelector('#exchangeOutput'));
};







let dropdown = document.querySelector('.dropdown');
let dropdownBtn = document.querySelector('.dropdownBtn');

dropdownBtn.addEventListener('click', function() {
    dropdown.classList.toggle('show');
    if(dropdown.parentElement.querySelector('.show')) {
        getSymbols();
    };
});


function getSymbols() {
    let exchangeReq = new XMLHttpRequest();
    let base = document.querySelector('#base');
    url = `https://api.exchangeratesapi.io/latest?base=${base.value}`;
    exchangeReq.open('GET', url);
    exchangeReq.responseType = 'json';
    exchangeReq.send();
    exchangeReq.onload = function() {
        console.log(exchangeReq);
        dropdown.querySelector('ul').innerHTML = '';
        for(rate in exchangeReq.response.rates) {
            let rateItem = document.createElement('li');
            rateItem.innerHTML = `<input type="checkbox" value=${rate} /> ${rate}`;
            dropdown.querySelector('ul').appendChild(rateItem);
        }
        for(let i = 0; i < dropdown.querySelectorAll('ul > li > input').length; i++){
            dropdown.querySelectorAll('ul > li > input')[i].addEventListener('change', function() {
                if(dropdown.querySelectorAll('ul > li > input:checked').length === 0) {
                    dropdownBtn.querySelector('span').innerText = ``;
                    exchangeWrap.querySelector('button').disabled = true;
                };
                dropdownBtn.querySelector('span').innerText = `(${dropdown.querySelectorAll('ul > li > input:checked').length})`;
                exchangeWrap.querySelector('button').disabled = false;
            });
        };
    }; 
};
