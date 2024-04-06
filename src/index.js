import axios from "axios";
import Notiflix from "notiflix";

const API_KEY = "43051643-98627d9f4a218556dcfa4db08";
const BASE_URL = "https://pixabay.com/api/?";
let page = 1;
let refs = {
    form: document.getElementById("search-form"),
};
let params = new URLSearchParams({
    key: API_KEY,
    page: page,
    per_page: 40,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
});

refs.form.addEventListener("submit", async e => { 
    e.preventDefault();
    let q = e.target.elements['searchQuery'].value;    
    if (q.trim() === "") {
        return;
    }
    if (page > 1) {
        page = 1;
        params.set('page',1);
    }
    document.getElementById("gallery").innerHTML = "";
    params.append('q', q);
    await fetchImages(params);
    console.log(params.get('page'));
    return params;
});

async function fetchImages(params) { 
    try {
        let response = await axios.get(BASE_URL + params);
        data = response.data.hits;
        if (data.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        }

        let oldButton = document.getElementById('loadMoreDiv');
        if (oldButton) {
            oldButton.remove();   
        }

        let renderCard = data.map(({ 
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        }) => {
            return `<div class="card photo-card" style="width: 300px;">
                        <img src="${webformatURL}" class="card-img-top" alt="${tags}" loading="lazy" data-picture="${largeImageURL}" />
                        <div class="card-body info" style="display: flex; flex-wrap: wrap; gap: 4px">
                            <div>
                                <p class="card-text info-item"
                                style="display: flex; flex-direction: column; align-items: center; font-size: 15px">
                                <b>Likes</b>
                                ${likes}
                                </p>
                            </div>
                            <div>
                                <p class="card-text info-item"
                                style="display: flex; flex-direction: column; align-items: center; font-size: 15px">
                                <b>Views</b>
                                ${views}
                                </p>
                            </div>
                            <div>
                                <p class="card-text info-item"
                                style="display: flex; flex-direction: column; align-items: center; font-size: 15px">
                                <b>Comments</b>
                                ${comments}
                                </p>
                            </div>
                            <div>
                                <p class="card-text info-item"
                                style="display: flex; flex-direction: column; align-items: center; font-size: 15px">
                                <b>Downloads</b>
                                ${downloads}
                                </p>
                            </div>
                        </div>
                    </div>`;
        });
        
        let button = document.createElement('button');
        let div = document.createElement('div');
        div.id = 'loadMoreDiv';
        div.style.width = '100%';
        div.style.display = 'flex';
        div.style.justifyContent = 'center';

        button.type = 'button';
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Load more';
        button.style.display = 'block';
        button.addEventListener("click", fetchMore);
        
        document.getElementById("gallery").innerHTML += renderCard;
        div.append(button);
        document.getElementById("gallery").append(div);

    } catch (error) {
        Notiflix.Notify.failure("Error de conexion");
        return [];
    }
}

async function fetchMore() { 
    page += 1;
    params.set('page', page);
    console.log(params.get('page'));
    await fetchImages(params);
}