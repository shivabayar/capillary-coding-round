"use strict";

$("#searchclear").click(function(){
    $("#searchinput").val('');
});

class Controller {
    constructor() {
        this.view = new View(this);
        this.getSearch()
        .then((results)=> {
            console.log(results);
            this.view.render(results);
        });
    }

    getSearch() {
        return fetch('/data/games.json')
        .then((results) => results.json())
        .catch((error) => console.error("Something went wrong!!!", error));
    }

    filterSearch(query) {
        query = query.trim().toLowerCase();
        this.getSearch()
        .then((results)=> {
            console.log('from filter search',results);
            console.log('yasdfsadf',);
            const filteredResults = results.filter((result) => {
                const values = Object.values(result);
                const filteredObj = values.filter((res) => typeof res === "string" && res.toLowerCase().includes(query));
                if(filteredObj.length > 0)
                    return true;
                return false;
            });
            this.view.render(filteredResults);
        });
    }
}

class View {
    constructor(controller) {
        this.controller = controller;
        this.searchContainer = $("#search-results-container");
        const self = this;
        this.searchBar = $("#searchinput").change(function() {
            console.log($(this).val());
            self.controller.filterSearch($(this).val())
        });
    }

    render(results) {
        let resultText = "";
        this.searchContainer.empty();
        for(let result of results) {
            resultText += `<div class="search-result">
                <div class="search-main-content" tabindex="0">
                    <img src="${result.imagePath}" alt="Search results images" tabindex="0">
                    <div class="search-result-text">
                        <h3 class="search-result-title" tabindex="0">
                            ${result.title}
                        </h3>
                        <h6 class="search-result-description" tabindex="0">
                            ${result.description}
                        </h6>
                    </div>
                    <i class="${result.isEditorChoice? 'fas fa-star': 'far fa-star'}"></i>
                </div>
                <div class="search-footer-content">
                    <span class="genere" tabindex="0">Genere: ${result.genere}</span>
                    <span class="ratings" tabindex="0">${result.ratings}</span>
                </div>
            </div>`;
        };
        const resultsNodes = $.parseHTML(resultText);
        this.searchContainer.append(resultsNodes);
    }
}

const controller = new Controller();
