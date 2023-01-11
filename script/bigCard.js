async function getPokemonBigCard(Id) {
    let pokeId = document.getElementById('search-input');
    getPokemonByIdBigCard(Id);
    setTimeout(function () {
        pokeId.value = '';
        currentPokemon = '';
    }, 500);
}


async function getPokemonByIdBigCard(id) {
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
    let bigCard = document.getElementById('big-card');
    let pokeImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pokeId = currentPokemon['id'];
    let pokeName = currentPokemon['name'];
    let bgClassName = currentPokemon['types'][0]['type']['name'];
    let height = currentPokemon['height'];
    let weight = currentPokemon['weight'];
    let baseExp = currentPokemon['base_experience'];
    height = formatNumber(height);
    weight = formatNumber(weight);
    bigCardDiv.classList.remove('d-none');
    pokeName = upperCaseFirstLetter(pokeName);
    typesDivId++;
    pokeName = translateNameIfSetAndAvaiable(pokeId, pokeName);

    let nameSpan = document.getElementById('big-card-name');
    let idSpan = document.getElementById('big-card-id')
    let imgSrc = document.getElementById('big-card-img');
    let heightSpan = document.getElementById('height-span');
    let weightSpan = document.getElementById('weight-span');
    let expirienceSpan = document.getElementById('expirience-span');
    bigCard.className = '';
    bigCard.classList.add('card', 'big-card', `card-bg-${bgClassName}`);
    nameSpan.innerHTML = pokeName;
    idSpan.innerHTML = `${pokeId}#`;
    imgSrc.src = pokeImg;
    heightSpan.innerHTML = `${height} m`;
    weightSpan.innerHTML = `${weight} kg`;
    expirienceSpan.innerHTML = baseExp;

    getPokeStats();
    getBarWidth();
    getBigCardTypes();
    getBigCardAbilities();
    translateTypes();
    // Make the DIV element draggable:
    dragElement(document.getElementById("big-card-div"));
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


/*https://www.w3schools.com/howto/howto_js_draggable.asp*/
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