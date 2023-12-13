async function getPokemonByIdBigCard(id) {
    playBackgroundMusic();
    playAnySound('click-high');
    await getPokemonResponse(id);
    await getPokemonSpeciesResponse(id);
    renderBigCard();
    translateBigCardIfSet();
}


async function getPokemonResponse(id) {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    currentBigCardPokemon = await response.json();
}


async function getPokemonSpeciesResponse(id) {
    if (loadPokemonSpecies()) {
        let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
        let responseSpecies = await fetch(urlSpecies);
        currentBigCardSpeciesPokemon = await responseSpecies.json();
    }
}


function formatNumber(number) {
    let formatedNumber = number.toString();
    formatedNumber = formatedNumber + 0;
    formatedNumber = formatedNumber / 100;
    formatedNumber = formatedNumber.toLocaleString();
    return formatedNumber;
}


function renderBigCard() {
    prepareBigCard();

    bigCardinnerHTMLInfo();
    getPokeStats();
    getBarWidth();
    getBigCardTypes();
    getBigCardAbilities();
    dragElement(document.getElementById("big-card-div"));
    changeMouseStyle();
}


function prepareBigCard() {
    let bigCardDiv = document.getElementById('big-card-div');
    bigCardDiv.classList.remove('d-none');
    let bigCard = document.getElementById('big-card');
    bigCard.className = '';
    bigCard.classList.add('card', 'big-card', `card-bg-${currentBigCardPokemon['types'][0]['type']['name']}`);
}


function bigCardinnerHTMLInfo() {
    const { pokeImg, pokeId, pokeName, height, weight, baseExp } = getBigCardInfo();
    const { nameSpan, idSpan, imgSrc, heightSpan, weightSpan, expirienceSpan } = getBigCardIds();

    nameSpan.innerHTML = pokeName;
    idSpan.innerHTML = `${pokeId}#`;
    imgSrc.src = pokeImg;
    heightSpan.innerHTML = `${height} m`;
    weightSpan.innerHTML = `${weight} kg`;
    expirienceSpan.innerHTML = baseExp;
}


function getBigCardIds() {
    return {
        nameSpan: document.getElementById('big-card-name'),
        idSpan: document.getElementById('big-card-id'),
        imgSrc: document.getElementById('big-card-img'),
        heightSpan: document.getElementById('height-span'),
        weightSpan: document.getElementById('weight-span'),
        expirienceSpan: document.getElementById('expirience-span')
    }
}


function getBigCardInfo() {
    pokeName = getPokeNameBigCard();
    return {
        pokeImg: currentBigCardPokemon['sprites']['other']['official-artwork']['front_default'],
        pokeId: currentBigCardPokemon['id'],
        pokeName: pokeName,
        height: formatNumber(currentBigCardPokemon['height']),
        weight: formatNumber(currentBigCardPokemon['weight']),
        baseExp: currentBigCardPokemon['base_experience']
    }
}


function getPokeNameBigCard() {
    let languageId = getLanguageId();
    let pokeNameBigCard;
    if (loadPokemonSpecies()) {
        pokeNameBigCard = currentBigCardSpeciesPokemon['names'][languageId].name;
    } else {
        pokeNameBigCard = createPokemonName(currentPokemon['name']);
    }
    return pokeNameBigCard;
}


function changeMouseStyle() {
    let bigCardHeader = document.getElementById('header-1');
    bigCardHeader.onmouseenter = function () { body.style.cursor = 'move' };
    bigCardHeader.onmouseleave = function () { body.style.cursor = 'default' };
}


function getPokeStats() {
    let pokeStats = currentBigCardPokemon['stats'];
    for (let i = 0; i < pokeStats.length; i++) {
        let statSpan = document.getElementById(`stat-${i}`);
        statSpan.innerHTML = pokeStats[i]['base_stat'];
    }
}


function getBarWidth() {
    let pokeStats = currentBigCardPokemon['stats'];
    for (let i = 0; i < pokeStats.length; i++) {
        let barWidth = document.getElementById(`stat-bar-${i}`)
        let pokeStat = pokeStats[i]['base_stat'];
        pokeStat = pokeStat / 3;
        barWidth.style.width = `${pokeStat}%`;
    }
}


function getBigCardAbilities() {
    let abilitiesDiv = document.getElementById('abilities-div');
    let abilities = currentBigCardPokemon['abilities'];
    abilitiesDiv.innerHTML = '';

    for (let i = 0; i < abilities.length; i++) {
        let ability = currentBigCardPokemon['abilities'][i]['ability']['name'];
        ability = translateAndPrepareAbilityName(ability);
        abilitiesDiv.innerHTML += /*html*/`
        <div class="type-div"><span>${ability}</span></div>
        `;
    }
}


function translateAndPrepareAbilityName(ability) {
    if (translationNum == 1) {
        foundAbility = searchAbilitiesTranslations(ability);
        ability = setAbilityName(foundAbility, ability);
    } else {
        ability = prepareAbilityName(ability);
    }
    return ability;
}


function setAbilityName(foundAbility, ability) {
    if (foundAbility) {
        ability = foundAbility;
    } else {
        console.log('could not find ability translation:', ability);
        ability = prepareAbilityName(ability);
    }
    return ability;
}


function getBigCardTypes() {
    let pokeTypes = currentBigCardPokemon['types'];
    let typesDiv = document.getElementById('big-card-types');
    typesDiv.innerHTML = '';
    for (let a = 0; a < pokeTypes.length; a++) {
        let pokeType = currentBigCardPokemon['types'][a]['type']['name'];
        pokeType = upperCaseFirstLetter(pokeType);
        typesDiv.innerHTML += /*html*/`
            <div class="type-div big-card-type">
                <span class=" type-span-big-card">
                    ${pokeType}
                </span>
            </div>
            `;
    }
}


function getDreamWorldImg() {
    let img = document.getElementById("big-card-img");
    let dreamWorldImg = currentBigCardPokemon['sprites']['other']['dream_world']['front_default'];
    if (dreamWorldImg) {
        img.src = dreamWorldImg;
    }

}


function getNormalImg() {
    let img = document.getElementById("big-card-img");
    img.src = currentBigCardPokemon['sprites']['other']['official-artwork']['front_default'];
}


function dragElement(elmnt) {

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header-1")) {
        document.getElementById(elmnt.id + "header-1").onmousedown = dragMouseDown;
    } else {
        elmnt.onmousedown = dragMouseDown;
    }


    function dragMouseDown(e) {
        body.style.cursor = 'move';
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }


    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }


    function closeDragElement() {
        body.style.cursor = 'default';
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


function translateBigCardIfSet() {
    if (translationNum == 1) {
        translateToGerman();
        translateTypesIfSet();
    }
}