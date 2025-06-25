window.addEventListener('load', () => {

    document.getElementById('search_form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('results').innerHTML = '';
        let searchItem = document.getElementById('search').value;
        const url = ` https://api.tvmaze.com/search/shows?q=${searchItem}`;
        const searchShow = async () => {
            try {
                const res = await axios.get(url);
                const showsObject = res.data;
                if (showsObject.length > 0) {
                    return makeImages(showsObject);
                } else {
                    return noResults();
                }
            } catch (error) {
                return error;
            }
        }
        searchShow();
        document.getElementById('search_form').reset();
    })

    const makeImages = (shows) => {
        for (let result of shows) {
            if (result.show.image && result.show.externals.thetvdb) {
                const resultContainer = document.createElement('div');
                resultContainer.classList.add('result-item', 'mw-100', 'col-sm-6', 'col-md-4', 'col-lg-2', 'text-center', 'rounded');

                const resultImage = document.createElement('img');
                resultImage.src = result.show.image.medium;;
                resultImage.alt = `${result.show.name} display image.`;
                resultImage.classList.add('result-image', 'img-fluid', 'rounded');
                resultImage.setAttribute('show-id', result.show.externals.thetvdb);

                resultContainer.append(resultImage);

                document.getElementById('results').append(resultContainer);
            }
        }
    }

    const noResults = () => {
        const errorMessage = document.createElement('p');
        errorMessage.innerHTML = 'No Results Found :(';
        errorMessage.classList.add('text-center')
        document.getElementById('results').append(errorMessage);
    };

    document.getElementById('results').addEventListener('click', (e) => {

        if (e.target.closest('.result-image').getAttribute('show-id') !== null) {
            const showID = e.target.closest('.result-image').getAttribute('show-id');
            const getShowInfo = async () => {
                try {
                    const res = await axios.get(`https://api.tvmaze.com/lookup/shows?thetvdb=${showID}`);
                    const showObject = res.data;
                    return updateModal(showObject);
                } catch (error) {
                    return error;
                }
            }
            getShowInfo();
        }
    });

    const updateModal = (show) => {
        const modalPopup = new bootstrap.Modal(document.getElementById("showModal"), {});
        const modalTitle = document.getElementById('modal_title');
        const modalImage = document.getElementById('modal_image');
        const modalDescription = document.getElementById('modal_description');
        const modalLanguage = document.getElementById('modal_language');
        const modalGenres = document.getElementById('modal_genres');
        modalTitle.innerHTML = show.name;
        modalImage.src = show.image.medium;
        modalImage.alt = `Image of the ${show.name} T.V. show.`;
        modalDescription.innerHTML = show.summary;
        modalLanguage.innerHTML = `Language: ${show.language}`;
        if (show.genres) {
            modalGenres.innerHTML = `Genres: ${show.genres.join(" | ")}`;
        }
        modalPopup.show()
    };
})