

function getNews() {
    let apiKey = 'becd678965f34642b4df5dbba8494e67';
    let apiLang = 'us';
    let apiEndpoint = 'top-headlines';
    let reqUrl = `https://newsapi.org/v2/${apiEndpoint}?country=${apiLang}&apiKey=${apiKey}`;

    let req = new XMLHttpRequest();
    req.open('GET', reqUrl);
    req.responseType = 'json';
    req.send();
    req.onload = function() {
        let articles = req.response.articles;
        console.log(articles);
        for(let i = 0; i < articles.length; i++) {
            let listItem = document.createElement('li');
            let d = new Date(articles[i].publishedAt);
            let now = new Date();
            listItem.innerHTML = `<p>${articles[i].title}</p><small>Published at: ${d}</small><p>${moment(d).fromNow()}</p>`;
            document.querySelector('#feedContent > ul').appendChild(listItem);
        }
    };
};
