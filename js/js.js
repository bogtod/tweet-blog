
function showLoader(status) {
    const loading = document.querySelector('#loading');
    if(status === 'on') {
        loading.style.display = 'flex';
    } else if(status === 'off') {
        loading.style.display = 'none';
    };
};



document.querySelector('.searchForm').onsubmit = function(form) {
    form.preventDefault();
    console.log(form)
    showLoader('on');
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

function removeActive() {
    let actives = document.querySelectorAll('.active');
    for(let x = 0; x < actives.length; x++) {
        actives[x].classList.remove('active');
    };
}

let feedControls = document.querySelectorAll('#feedOptions > button');
for (let i = 0; i < feedControls.length; i++) {
    feedControls[i].addEventListener('click', function(btn) {
        showLoader('on');
        getNews('top-headlines', '', btn.target.value);
        removeActive();
        if(document.querySelector('.searchResult') !== null) {
            document.querySelector('.searchResult').remove();
        };
        btn.target.classList.add('active');
    });
}

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
    
    function request(url) {
        document.querySelector('#feedContent').innerHTML = '';
        let req = new XMLHttpRequest();
        req.addEventListener('error', function(error){console.log(error)});
        req.open('GET', url);
        req.responseType = 'json';
        req.send();
        req.onload = function() {
            displayArticles(req.response.articles);
            console.log(`${req.response} ${req.status}`);
            showLoader('off');
        };
    };
};

// getNews();

function displayArticles(articles) {
    for(let i = 0; i < articles.length; i++) {
        let listItem = document.createElement('article');
        let d = new Date(articles[i].publishedAt);
        listItem.innerHTML = `
            <span><i class="fas fa-stopwatch"></i> ${moment(d).fromNow()}</span>
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
        document.querySelector('#feedContent').appendChild(listItem);
    };
};