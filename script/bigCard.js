async function getPokemonByIdBigCard(id) {
    playBackgroundMusic();
    playAnySound('click-high');
    let url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
    renderBigCard();

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
    bigCard.classList.add('card', 'big-card', `card-bg-${currentPokemon['types'][0]['type']['name']}`);

    bigCardinnerHTMLInfo();
    getPokeStats();
    getBarWidth();
    getBigCardTypes();
    getBigCardAbilities();
    translateTypesIfSet();
    // Make the DIV element draggable:
    dragElement(document.getElementById("big-card-div"));
    changeMouseStyle();
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
    pokeName = createPokemonName(currentPokemon['name'], currentPokemon['id'])
    return {
        pokeImg: currentPokemon['sprites']['other']['official-artwork']['front_default'],
        pokeId: currentPokemon['id'],
        pokeName: pokeName,
        height: formatNumber(currentPokemon['height']),
        weight: formatNumber(currentPokemon['weight']),
        baseExp: currentPokemon['base_experience']
    }
}


function changeMouseStyle() {
    let bigCardHeader = document.getElementById('header-1');
    bigCardHeader.onmouseenter = function () { body.style.cursor = 'move' };
    bigCardHeader.onmouseleave = function () { body.style.cursor = 'default' };
}


function getPokeStats() {
    let pokeStats = currentPokemon['stats'];
    for (let i = 0; i < pokeStats.length; i++) {
        let statSpan = document.getElementById(`stat-${i}`);
        statSpan.innerHTML = pokeStats[i]['base_stat'];
    }
}


function getBarWidth() {
    let pokeStats = currentPokemon['stats'];
    for (let i = 0; i < pokeStats.length; i++) {
        let barWidth = document.getElementById(`stat-bar-${i}`)
        let pokeStat = pokeStats[i]['base_stat'];
        pokeStat = pokeStat / 3;
        barWidth.style.width = `${pokeStat}%`;
    }
}


function getBigCardAbilities() {
    let abilitiesDiv = document.getElementById('abilities-div');
    let abilities = currentPokemon['abilities'];
    abilitiesDiv.innerHTML = '';
    for (let i = 0; i < abilities.length; i++) {
        let ability = currentPokemon['abilities'][i]['ability']['name'];
        abilitiesDiv.innerHTML += /*html*/`
        <div class="type-div"><span>${ability}</span></div>
        `;
    }
}


function getBigCardTypes() {
    let pokeTypes = currentPokemon['types'];
    let typesDiv = document.getElementById('big-card-types');
    typesDiv.innerHTML = '';
    for (let a = 0; a < pokeTypes.length; a++) {
        let pokeType = currentPokemon['types'][a]['type']['name'];
        pokeType = upperCaseFirstLetter(pokeType);
        typesDiv.innerHTML = '';
        typesDiv.innerHTML += /*html*/`
            <div class="type-div">
                <span>
                    ${pokeType}
                </span>
            </div>
            `;
    }
}


function getDreamWorldImg() {
    let img = document.getElementById("big-card-img");
    let dreamWorldImg = currentPokemon['sprites']['other']['dream_world']['front_default'];
    if (dreamWorldImg) {
        img.src = dreamWorldImg;
    }

}


function getNormalImg() {
    let img = document.getElementById("big-card-img");
    img.src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
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