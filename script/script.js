let currentPokemon;
let pokeLoadNumber = 25;
let offsetNum = 0;
let startNum = 0;

let lastCardId = 0
let typesDivId = -1;
let translationNum = 0;


async function getPokemonJSON(startFrom) {
    getSavedSettings();
    startNum = checkStartFrom(startFrom);

    let listUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${startNum}&limit=${pokeLoadNumber}"`;
    let listResponse = await fetch(listUrl);
    let pokeList = await listResponse.json();
    loadPokemonJSON(pokeList);
}


async function loadPokemonJSON(pokeList) {
    onOrOffAllLinks('off');
    let List = pokeList['results'];
    for (let i = 0; i < List.length; i++) {
        let pokeUrl = List[i]['url'];
        let response = await fetch(pokeUrl);
        currentPokemon = await response.json();
        renderCard('pokedex');
    }
    lastCardId = currentPokemon['id'];
    translateTypes();
    onOrOffAllLinks('on');
}


async function searchPokemonById() {
    let pokeId = document.getElementById('search-input');
    if (pokeId.value >= 1) {
        getPokemonById(pokeId.value);
        setTimeout(function () {
            pokeId.value = '';
            currentPokemon = '';
        }, 500);
    }
}


async function getPokemonById(id) {
    let pokeFoundDiv = document.getElementById('pokedex-found-div');
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    pokeFoundDiv.classList.remove('d-none');
    currentPokemon = await response.json();
    renderCard('pokedex-found');
    translateTypes();
}


function loadMore() {
    onOrOffAllLinks('off');
    pokeLoadNumber = 25;
    saveNumValue('poke-load-num', pokeLoadNumber);
    getPokemonJSON('last-card');
}


function renderCard(divName) {
    let pokeDiv = document.getElementById(`${divName}`);
    let pokeImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pokeId = currentPokemon['id'];
    let pokeName = currentPokemon['name'];

    let bgClassName = currentPokemon['types'][0]['type']['name'];
    pokeName = upperCaseFirstLetter(pokeName);
    typesDivId++;
    pokeName = translateNameIfSetAndAvaiable(pokeId, pokeName);

    pokeDiv.innerHTML += getCardHTML(pokeImg, pokeId, pokeName, bgClassName);

    getPokemonTypes();
}


function getCardHTML(pokeImg, pokeId, pokeName, bgClassName) {
    return /*html*/`
        <div onclick="getPokemonByIdBigCard(${pokeId})" class="card poke-card card-bg-${bgClassName}">
    <div class="d-flex">
        <img src="img/ellipses.png" class="poke-shadow">
        <div class="card-img">
            <img id="poke-img" style="width:100%" src="${pokeImg}" alt="...">
        </div>
    </div>
    <div class="card-body poke-card-body">
        <div class="card-header text-dark">
            <h4>${pokeName}</h4>
            <span>${pokeId}#</span>
        </div>
        <div class="types-div" id="types-div-${typesDivId}"></div>
    </div>
</div>
`;
}


function setTranslationNum() {
    if (translationNum == 0) {
        translationNum++;
        saveNumValue('translation-num', translationNum);
    } else {
        translationNum--;
        saveNumValue('translation-num', translationNum)
    }
    clearPokedex();
    getPokemonJSON();
}


function setOffsetNumber(genNum) {
    let offsetInput = document.getElementById('offset-input');
    if (genNum >= 0) {
        offsetNum = genNum;
        offsetInput.value = genNum;
    } else {
        offsetNum = offsetInput.value;
    }
    saveNumValue('offset-num', offsetNum);
    clearPokedex();
    getPokemonJSON('offset');
}


function setNumberLoadedPokemon() {
    let numberInput = document.getElementById('number-input').value;
    pokeLoadNumber = numberInput;

    saveNumValue('poke-load-num', pokeLoadNumber);
    clearPokedex();
    getPokemonJSON('offset');
}


function saveNumValue(key, value) {
    localStorage.setItem(key, value);
}


function getSavedTranslationNum() {
    let savedNum = localStorage.getItem('translation-num');
    if (savedNum) {
        translationNum = savedNum;
    }
}


function setFlagIcon() {
    let flagImg = document.getElementById('flag-img');
    if (translationNum == 0) {
        flagImg.src = 'img/eng-flag-icon.png'
    }
    if (translationNum == 1) {
        flagImg.src = 'img/ger-flag-icon.png'
    }
}


function getSavedPokeLoadNum() {
    let numberInput = document.getElementById('number-input');
    let savedNum = localStorage.getItem('poke-load-num');

    if (savedNum) {
        pokeLoadNumber = savedNum;
        numberInput.value = savedNum;
    } else {
        numberInput.value = pokeLoadNumber;
    }
}


function getSavedOffsetNum() {
    let offsetInput = document.getElementById('offset-input');
    let savedNum = localStorage.getItem('offset-num');

    if (savedNum) {
        offsetNum = savedNum;
        offsetInput.value = savedNum;
    } else {
        offsetInput.value = offsetNum;
    }
}


function clearPokedex() {
    let pokedex = document.getElementById('pokedex');
    pokedex.innerHTML = '';
}


function getPokemonTypes() {
    let pokeTypes = currentPokemon['types'];

    for (let a = 0; a < pokeTypes.length; a++) {
        let typesDiv = document.getElementById(`types-div-${typesDivId}`);
        let pokeType = currentPokemon['types'][a]['type']['name'];
        pokeType = upperCaseFirstLetter(pokeType);
        typesDiv.innerHTML += /*html*/`
            <div class="type-div">
                <div>    
                    <span>
                        ${pokeType}
                    </span>
                </div>
            </div>
            `;
    }
}


function translateNameIfSetAndAvaiable(pokeId, pokeName) {
    if (translationNum == 0) {
        return pokeName;
    }
    if (pokeNamesDe[pokeId - 1]) {
        pokeName = pokeNamesDe[pokeId - 1];
    }
    return pokeName;
}


function getSavedSettings() {
    getSavedTranslationNum();
    getSavedPokeLoadNum();
    getSavedOffsetNum();
    setFlagIcon();
}


function checkStartFrom(startFrom) {
    if (startFrom == 'offset') {
        startNum = offsetNum;
        return startNum;
    }
    if (startFrom == 'last-card') {
        startNum = lastCardId;
        return startNum;
    }
}


function translateTypes() {
    if (translationNum == 0) {
        return
    }
    let allSpans = document.getElementsByTagName('span');

    for (let i = 0; i < allSpans.length; i++) {
        let string = allSpans[i].innerHTML;
        let span = allSpans[i];

        if (string.includes('Water')) {
            span.innerHTML = 'Wasser';
        }
        if (string.includes('Grass')) {
            span.innerHTML = 'Pflanze';
        }
        if (string.includes('Fire')) {
            span.innerHTML = 'Feuer';
        }
        if (string.includes('Ground')) {
            span.innerHTML = 'Boden';
        }
        if (string.includes('Bug')) {
            span.innerHTML = 'Käfer';
        }
        if (string.includes('Steel')) {
            span.innerHTML = 'Stahl';
        }
        if (string.includes('Dark')) {
            span.innerHTML = 'Unlicht';
        }
        if (string.includes('Flying')) {
            span.innerHTML = 'Fliegen';
        }
        if (string.includes('Poison')) {
            span.innerHTML = 'Gift';
        }
        if (string.includes('Ghost')) {
            span.innerHTML = 'Geist';
        }
        if (string.includes('Dragon')) {
            span.innerHTML = 'Drache';
        }
        if (string.includes('Electric')) {
            span.innerHTML = 'Elektrizität';
        }
        if (string.includes('Fighting')) {
            span.innerHTML = 'Kampf';
        }
        if (string.includes('Fairy')) {
            span.innerHTML = 'Fee';
        }
        if (string.includes('Ice')) {
            span.innerHTML = 'Eis';
        }
        if (string.includes('Rock')) {
            span.innerHTML = 'Stein';
        }
        if (string.includes('Psychic')) {
            span.innerHTML = 'Psycho';
        }
        if (string.includes('Normal')) {
            span.innerHTML = 'Normal';
        }
    }
}


function onOrOffAllLinks(onOff) {
    let allLinks = document.getElementsByTagName('a');

    for (let i = 0; i < allLinks.length; i++) {
        let link = allLinks[i];
        if (onOff == 'on') {
            link.classList.remove('pointer-none');
        }
        if (onOff == 'off') {
            link.classList.add('pointer-none');
        }
    }
}


function upperCaseFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}


function showImpressumOrPrivacyPolicy(imp_pri) {
    let impPri = document.getElementById(`${imp_pri}`);
    impPri.classList.remove('d-none');
    if (imp_pri == 'privacy-policy') {
        bodyOverflowOnOff(1);
    }
}


function closeImpressumOrPrivacyPolicy(imp_pri) {
    let impPri = document.getElementById(`${imp_pri}`);
    impPri.classList.add('d-none');
    bodyOverflowOnOff(0);
}


function bodyOverflowOnOff(onOff) {
    let body = document.getElementById('body');
    if (onOff == 1) {
        body.classList.add('overflow-hidden');
    }
    if (onOff == 0) {
        body.classList.remove('overflow-hidden');
    }
}