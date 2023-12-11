async function getPokemonByIdBigCard(id) {
    playBackgroundMusic();
    playAnySound('click-high');
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    currentBigCardPokemon = await response.json();
    if (loadPokemonSpecies()) {
        currentBigCardSpeciesPokemon = await getPokemonSpeciesByIdBigCard(id);
    }
    renderBigCard();
    if (translationNum == 1) {
        translateToGerman();
        translateTypesIfSet();
    }
}

async function getPokemonSpeciesByIdBigCard(id) {
    let urlSpecies = `https://pokeapi.co/api/v2/pokemon-species/${id}`;
    let responseSpecies = await fetch(urlSpecies);
    return await responseSpecies.json();
}

function formatNumber(number) {
    let formatedNumber = number.toString();
    formatedNumber = formatedNumber + 0;
    formatedNumber = formatedNumber / 100;
    formatedNumber = formatedNumber.toLocaleString();
    return formatedNumber;
}


function renderBigCard() {
    let bigCardDiv = document.getElementById('big-card-div');
    bigCardDiv.classList.remove('d-none');
    let bigCard = document.getElementById('big-card');
    bigCard.className = '';
    bigCard.classList.add('card', 'big-card', `card-bg-${currentBigCardPokemon['types'][0]['type']['name']}`);

    bigCardinnerHTMLInfo();
    getPokeStats();
    getBarWidth();
    getBigCardTypes();
    getBigCardAbilities();
    //translateTypesIfSet();
    dragElement(document.getElementById("big-card-div"));
    changeMouseStyle();
}


// function translateTextIfSet() {
//     if (translatenNum == 1) {
//         translateBigCardToGerman();
//     } else if (translatenNum == 0) {
//         translateBigCardToEnglish();
//     }
// }


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

        if (translationNum == 1) {
            foundAbility = searchAbilitiesTranslations(ability);
            if (foundAbility) {
                ability = foundAbility;
            } else {
                console.log('could not find ability')
            }
        } else {
            ability = prepareAbilityName(ability);
        }
        abilitiesDiv.innerHTML += /*html*/`
        <div class="type-div"><span>${ability}</span></div>
        `;
    }
}




function getBigCardTypes() {
    let pokeTypes = currentBigCardPokemon['types'];
    let typesDiv = document.getElementById('big-card-types');
    typesDiv.innerHTML = '';
    for (let a = 0; a < pokeTypes.length; a++) {
        let pokeType = currentBigCardPokemon['types'][a]['type']['name'];
        pokeType = upperCaseFirstLetter(pokeType);
        //typesDiv.innerHTML = '';
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
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header-1").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }


    function dragMouseDown(e) {
        body.style.cursor = 'move';
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }


    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }


    function closeDragElement() {
        body.style.cursor = 'default';
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}