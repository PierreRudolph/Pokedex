let currentPokemon;
let currentPokemonSpecies;
let pokeLoadNumber = 25;
let offsetNum = 0;
let startNum = 0;

let lastCardId = 0
let typesDivId = -1;
let translationNum = 1;
let currenBigCardPokemon;
let currentBigCardSpeciesPokemon;
let foundPokemon = [];
let foundPokemonLoaded = 0;


async function getPokemonJSON(startFrom) {
    getSavedSettings();
    startNum = checkStartFrom(startFrom);

    let listUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${startNum}&limit=${pokeLoadNumber}"`;
    let listResponse = await fetch(listUrl);
    let pokeList = await listResponse.json();
    let pokeListSpecies;
    pokeList = pokeList['results'];
    pokeListSpecies = await getPokeListSpeciesIfAviable(pokeListSpecies);

    loadPokemonJSON(pokeList, pokeListSpecies);
}


async function getPokeListSpeciesIfAviable(pokeListSpecies) {
    if (loadPokemonSpecies()) {
        pokeListSpecies = await getPokemonSpeciesJSON(startNum);
        pokeListSpecies = pokeListSpecies['results'];
    }
    return pokeListSpecies
}


async function getPokemonSpeciesJSON(startNum) {
    let listUrlSpecies = `https://pokeapi.co/api/v2/pokemon-species/?offset=${startNum}&limit=${pokeLoadNumber}"`;
    let listTwoResponse = await fetch(listUrlSpecies);
    return await listTwoResponse.json();
}


async function loadPokemonJSON(pokeList, pokeListSpecies) {
    onOrOffAllLinks('off');
    await renderCards(pokeList, pokeListSpecies);
    lastCardId = currentPokemon['id'];
    translateTypesIfSet();
    onOrOffAllLinks('on');
    playAnySound('click-low');
    loadFoundPokemonFirstTime()
}


async function renderCards(pokeList, pokeListSpecies) {
    for (let i = 0; i < pokeList.length; i++) {
        let pokeUrl = pokeList[i]['url'];
        let response = await fetch(pokeUrl);
        currentPokemon = await response.json();
        if (loadPokemonSpecies()) {
            currentPokemonSpecies = await loadPokemonSpeciesJSON(pokeListSpecies, i);
        }
        renderCard('pokedex');
    }
}


async function loadPokemonSpeciesJSON(pokeListSpecies, i) {
    let pokeSpeciesUrl = pokeListSpecies[i]['url'];
    let responseSpecies = await fetch(pokeSpeciesUrl);
    return await responseSpecies.json();
}


function loadFoundPokemonFirstTime() {
    if (foundPokemonLoaded == 0) {
        loadFoundPokemon();
        foundPokemonLoaded = 1;
    }
}


function loadFoundPokemon() {
    getSavedFoundPokemon();
    if (foundPokemon.length > 0) {
        for (let i = 0; i < foundPokemon.length; i++) {
            currentPokemon = foundPokemon[i];
            renderCard('pokedex-found')
        }
    }
}


function getSavedFoundPokemon() {
    let savFouPoke = localStorage.getItem(`found-pokemon`);
    let savFouPokeToArray = JSON.parse(savFouPoke);

    if (savFouPokeToArray) {
        for (let i = 0; i < savFouPokeToArray.length; i++) {
            getPokemonById(savFouPokeToArray[i]);
            setTimeout(function () {
                currentPokemon = '';
            }, 500);
        }
        showPokemonFoundDiv();
        setDexDivFoundDivPadding();
    }
}


function saveFoundPokemon() {
    foundPokemon.push(currentPokemon['id']);
    localStorage.setItem('found-pokemon', JSON.stringify(foundPokemon));
}


function searchPokemonById() {
    let pokeId = document.getElementById('search-input');

    if (pokeId.value >= 1) {
        playAnySound('click-high');
        getPokemonById(pokeId.value);
        showPokemonFoundDiv();
        setDexDivFoundDivPadding();
        setTimeout(function () {
            pokeId.value = '';
            currentPokemon = '';
        }, 500);
    } else {
        playAnySound('click-low');
    }
}


async function getPokemonById(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    let response = await fetch(url);
    let responseSpecies = await fetch(urlSpecies);
    currentPokemon = await response.json();
    currentPokemonSpecies = await responseSpecies.json();
    saveFoundPokemon();
    renderCard('pokedex-found');
    translateTypesIfSet();
}


function loadMore() {
    playBackgroundMusic();
    playAnySound('click-high');
    onOrOffAllLinks('off');
    pokeLoadNumber = 25;
    saveNumValue('poke-load-num', pokeLoadNumber);
    getPokemonJSON('last-card');
}


function renderCard(divName) {
    let pokeDiv = document.getElementById(`${divName}`);
    let pokeName = getPokeName();
    let pokeImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pokeId = currentPokemon['id'];

    let bgClassName = currentPokemon['types'][0]['type']['name'];
    if (!pokeImg) {
        return;
    }
    typesDivId++;
    pokeDiv.innerHTML += getCardHTML(pokeImg, pokeId, pokeName, bgClassName);
    getPokemonTypes();
}


function getPokeName() {
    let languageId = getLanguageId();
    let pokeName;
    if (loadPokemonSpecies()) {
        pokeName = currentPokemonSpecies['names'][languageId].name;
    } else {
        pokeName = createPokemonName(currentPokemon['name']);
    }
    return pokeName;
}


function getCardHTML(pokeImg, pokeId, pokeName, bgClassName) {
    return /*html*/`
       <div>
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
                        <div class="types-div" id="types-div-${typesDivId}">
                        </div>
                    </div>
                </div>  
        </div>
`;
}


function getLanguageId() {
    let languageId;
    if (translationNum == 1) {
        languageId = '5';
    } else {
        languageId = '6';
    }
    return languageId;
}


function createPokemonName(pokeName) {
    return pokeName = upperCaseFirstLetter(pokeName);
}


function setOffsetNumber(genNum) {
    playAnySound('click-high');
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
    playAnySound('click-high');
    let numberInput = document.getElementById('number-input').value;
    pokeLoadNumber = numberInput;

    saveNumValue('poke-load-num', pokeLoadNumber);
    clearPokedex();
    getPokemonJSON('offset');
}


function saveNumValue(key, value) {
    localStorage.setItem(key, value);
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


function deletePokemonFound() {
    localStorage.removeItem('found-pokemon');
    clearPokedexFound();
    hidePokemonFoundDiv();
    removeDexDivFoundDivPadding();
}


function clearPokedexFound() {
    let pokedexFound = document.getElementById('pokedex-found');
    pokedexFound.innerHTML = '';
    foundPokemon = [];
    foundPokemonLoaded = 0;
}


function getPokemonTypes() {
    let pokeTypes = currentPokemon['types'];

    for (let a = 0; a < pokeTypes.length; a++) {
        let typesDiv = document.getElementById(`types-div-${typesDivId}`);
        let pokeType = currentPokemon['types'][a]['type']['name'];
        pokeType = upperCaseFirstLetter(pokeType);
        typesDiv.innerHTML += /*html*/`
            <div class="type-div">    
                    <span class="type-span">
                        ${pokeType}
                    </span>            
            </div>
            `;
    }
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


function loadPokemonSpecies() {
    if ((+startNum + +pokeLoadNumber) <= 1017) {
        return true;
    } else {
        return false;
    }
}


function showPokemonFoundDiv() {
    let pokeFoundDiv = document.getElementById('pokedex-found-div');
    pokeFoundDiv.classList.remove('d-none');
}


function setDexDivFoundDivPadding() {
    let pokedex = document.getElementById('pokedex');
    pokedex.classList.add('pokedex-padding-top-if-found-div-showing');
}


function hidePokemonFoundDiv() {
    let pokeFoundDiv = document.getElementById('pokedex-found-div');
    pokeFoundDiv.classList.add('d-none');
}


function removeDexDivFoundDivPadding() {
    let pokedex = document.getElementById('pokedex');
    pokedex.classList.remove('pokedex-padding-top-if-found-div-showing');
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


function reCreateName(name) {
    let splitedAbility;
    splitedAbility = name.split('-');
    abilityFirstWord = upperCaseFirstLetter(splitedAbility[0]);
    abilitySecondWord = upperCaseFirstLetter(splitedAbility[1]);
    return (abilityFirstWord + ' ' + abilitySecondWord);

}


function upperCaseFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}


function removeDisplayNone(imp_pri) {
    playAnySound('click-high');
    let impPri = document.getElementById(`${imp_pri}`);
    impPri.classList.remove('d-none');
    bodyOverflowOnOff(1);
}


function addDisplayNone(imp_pri) {
    playAnySound('click-low');
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


function playBackgroundMusic() {
    let music = document.getElementById('background-music');

    if (!isPlaying(music)) {
        music.load();
        music.volume = 0.5;
        music.play();
        music.loop = true;
    }
}


function isPlaying(audelem) {
    return !audelem.paused;
}


function playAnySound(soundName) {
    let sound = new Audio(src = `sounds/${soundName}.mp3`);
    sound.volume = 0.7;
    sound.load();
    sound.play();
}


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function scrollToTop() {
    window.scrollTo(0, 0);
}