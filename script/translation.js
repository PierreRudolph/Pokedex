function getSavedTranslationNum() {
    let savedNum = localStorage.getItem('translation-num');
    if (savedNum) {
        translationNum = savedNum;
    }
}


function setTranslationNum() {
    playAnySound('click-high');
    if (translationNum == 0) {
        translationNum++;
        saveNumValue('translation-num', translationNum);
        translateToGerman();
    } else {
        translationNum--;
        saveNumValue('translation-num', translationNum);
        translateToEnglish();
    }
    restartShowingContent();
}


function translateToGerman() {
    translateTextToGerman();
    translateBigCardToGerman();
}


function translateToEnglish() {
    translateTextToEnglish();
    translateBigCardToEnglish();
}


function restartShowingContent() {
    clearPokedex();
    clearPokedexFound();
    getPokemonJSON('offset');
    if (!checkIfBigCardIsShowing()) {
        renderBigCard();
    }
}

function checkIfBigCardIsShowing() {
    let bigCardDiv = document.getElementById('big-card-div');
    return bigCardDiv.classList.contains('d-none');
}


function translateTextToEnglish() {
    const { howMany, fromId, loadGen, findPoke, pokeFound, deleteFound, loadMore, imprint, dataPolicy } = getHTMLElementsText();
    howMany.innerHTML = 'How many Load?:';
    fromId.innerHTML = 'Load from Id#:';
    loadGen.innerHTML = 'Load Geneneration :';
    findPoke.innerHTML = 'Find Pokemon:';
    pokeFound.innerHTML = 'Pokemon Found:';
    deleteFound.innerHTML = 'Delete Found';
    loadMore.innerHTML = 'Load More';
    imprint.innerHTML = 'Imprint';
    dataPolicy.innerHTML = 'Privacy policy';
}


function translateTextToGerman() {
    const { howMany, fromId, loadGen, findPoke, pokeFound, deleteFound, loadMore, imprint, dataPolicy } = getHTMLElementsText();
    howMany.innerHTML = 'Pokemon Anzeigen:';
    fromId.innerHTML = 'Ab Id# Laden:';
    loadGen.innerHTML = 'Generation laden:';
    findPoke.innerHTML = 'Pokemon finden:';
    pokeFound.innerHTML = 'Gefundene Pokemon:';
    deleteFound.innerHTML = 'Gefundene Löschen';
    loadMore.innerHTML = 'Mehr Laden';
    imprint.innerHTML = 'Impressum';
    dataPolicy.innerHTML = 'Datenschutzerklärung';
}


function translateBigCardToEnglish() {
    const { baseStats, abilities, hp, attack, defense, specialAttack, specialDefense, speed, height, weight, types, baseExp, abilities2 } = getHtmlElementsBigCard();
    baseStats.innerHTML = 'Base stats';
    abilities.innerHTML = 'Abilities';
    hp.innerHTML = 'HP';
    attack.innerHTML = 'ATTACK';
    defense.innerHTML = 'DEFENSE';
    specialAttack.innerHTML = 'SPECIAL-ATTACK'
    specialDefense.innerHTML = 'SPECIAL-DEFENSE';
    speed.innerHTML = 'SPEED';
    height.innerHTML = 'Height';
    weight.innerHTML = 'Weight';
    types.innerHTML = 'Types';
    baseExp.innerHTML = 'BASE EXPIRIENCE';
    abilities2.innerHTML = 'Abilities';
}


function translateBigCardToGerman() {
    const { baseStats, abilities, hp, attack, defense, specialAttack, specialDefense, speed, height, weight, types, baseExp, abilities2 } = getHtmlElementsBigCard();
    baseStats.innerHTML = 'Basis werte';
    abilities.innerHTML = 'Fähigkeiten';
    hp.innerHTML = 'KP';
    attack.innerHTML = 'ANGRIFF';
    defense.innerHTML = 'VERTEIDIGUNG';
    specialAttack.innerHTML = 'SPEZIAL-ANGRIFF'
    specialDefense.innerHTML = 'SPEZAIL-VERTEIDIGUNG';
    speed.innerHTML = 'GESCHWINDIGKEIT';
    height.innerHTML = 'Größe';
    weight.innerHTML = 'Gewicht';
    types.innerHTML = 'Typen';
    baseExp.innerHTML = 'BASIS ERFAHRUNG';
    abilities2.innerHTML = 'Fähigkeiten';
}


function getHtmlElementsBigCard() {
    return {
        baseStats: document.getElementById('base-stats-text'),
        abilities: document.getElementById('abilities-text'),

        hp: document.getElementById('hp-text'),
        attack: document.getElementById('attack-text', 'attack2-text'),
        defense: document.getElementById('defense-text'),
        specialAttack: document.getElementById('special-attack-text'),
        specialDefense: document.getElementById('special-defense-text'),
        speed: document.getElementById('speed-text'),

        height: document.getElementById('height-text'),
        weight: document.getElementById('weight-text'),
        types: document.getElementById('types-text'),

        baseExp: document.getElementById('base-exp-text'),
        abilities2: document.getElementById('abilities2-text'),
    }
}


function getHTMLElementsText() {
    return {
        howMany: document.getElementById('how-many-text'),
        fromId: document.getElementById('from-id-text'),
        loadGen: document.getElementById('load-gen-text'),
        findPoke: document.getElementById('find-text'),
        pokeFound: document.getElementById('poke-found-text'),
        deleteFound: document.getElementById('delete-all-text'),
        loadMore: document.getElementById('load-more-text'),
        imprint: document.getElementById('imprint-text'),
        dataPolicy: document.getElementById('data-policy-text')
    }
}


function searchAbilitiesTranslations(abilityToSearchFor) {
    abilityToSearchFor = prepareAbilityName(abilityToSearchFor);
    for (let i = 0; i < abilitiesTranslations.length; i++) {
        const foundAbility = abilitiesTranslations[i].english;
        const foundAbilityGerman = abilitiesTranslations[i].german

        if (foundAbility == abilityToSearchFor) {
            return foundAbilityGerman;
        } else if (i > abilitiesTranslations.length) {
            console.log('Could not find Translation of searched Ability', abilityToSearchFor);
            return abilityToSearchFor;
        }
    }

}


function prepareAbilityName(abilityName) {
    if (abilityName.includes('-')) {
        return reCreateName(abilityName);
    } else {
        return upperCaseFirstLetter(abilityName);
    }
}


function translateTypesIfSet() {
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