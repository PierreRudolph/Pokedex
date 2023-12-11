let currentPokemon;
let pokeLoadNumber = 25;
let offsetNum = 0;
let startNum = 0;

let lastCardId = 0
let typesDivId = -1;
let translationNum = 0;
let currenBigCardPokemon;

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
    translateTypesIfSet();
    onOrOffAllLinks('on');
    playAnySound('click-low');
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

function showPokemonFoundDiv() {
    let pokeFoundDiv = document.getElementById('pokedex-found-div');
    pokeFoundDiv.classList.remove('d-none');
}

function setDexDivFoundDivPadding() {
    let pokedex = document.getElementById('pokedex');
    pokedex.classList.add('pokedex-padding-top-if-found-div-showing');
}

async function getPokemonById(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);

    currentPokemon = await response.json();
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
    let pokeImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pokeId = currentPokemon['id'];
    let pokeName = createPokemonName(currentPokemon['name'], pokeId);
    //let pokeName=currentPokemon['names']['5'].name

    let bgClassName = currentPokemon['types'][0]['type']['name'];
    if (!pokeImg) {
        return;
    }
    typesDivId++;
    pokeDiv.innerHTML += getCardHTML(pokeImg, pokeId, pokeName, bgClassName);
    getPokemonTypes();
}


function createPokemonName(pokeName, pokeId) {
    pokeName = upperCaseFirstLetter(pokeName);
    return translateNameIfSetAndAvaiable(pokeId, pokeName);
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


function clearPokedexFound() {
    let pokedexFound = document.getElementById('pokedex-found');
    pokedexFound.innerHTML = '';
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
                    <span class="type-span">
                        ${pokeType}
                    </span>
                </div>
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
    if (imp_pri == 'privacy-policy') {
        bodyOverflowOnOff(1);
    }
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
function isPlaying(audelem) { return !audelem.paused; }
function playAnySound(soundName) {
    let sound = new Audio(src = `sounds/${soundName}.mp3`);
    sound.volume = 0.7;
    sound.load();
    sound.play();
}