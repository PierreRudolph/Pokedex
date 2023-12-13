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
    translateDropdownToGerman();
    translateBigCardToGerman();
}


function translateToEnglish() {
    translateTextToEnglish();
    translateDropdownToEnglish()
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
    loadGen.innerHTML = 'Load Geneneration:';
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


function translateDropdownToEnglish() {
    const { genHeadline, load1, load2, load3, load4, load5, load6, load7, load8, load9, load10, load11, load12 } = getHTMLElementsDropdown();
    genHeadline.innerHTML = 'Pokemon Generations (National Index)';
    load1.innerHTML = 'From the Red and Blue Edition (1-151)';
    load2.innerHTML = 'From the Gold and Silver Edition (152-251)';
    load3.innerHTML = 'From the Ruby and Sapphire Edition (252-386)';
    load4.innerHTML = 'From the Diamond and Pearl Edition (387-493)';
    load5.innerHTML = 'From the Black and White Edition (494-649)';
    load6.innerHTML = 'From X and Y (650-721)';
    load7.innerHTML = 'From Sonne and Mond (722-802)';
    load8.innerHTML = 'From Ultra Sun and Ultra Moon (803-807)';
    load9.innerHTML = 'From Pokémon Let\'s Go (808-809)';
    load10.innerHTML = 'From Sword and Shield (810-898)';
    load11.innerHTML = 'From Pokémon Legends: Arceus (899-905)';
    load12.innerHTML = 'From Pokémon Legends: Scarlet and Violet (906-1017)';
}


function translateDropdownToGerman() {
    const { genHeadline, load1, load2, load3, load4, load5, load6, load7, load8, load9, load10, load11, load12 } = getHTMLElementsDropdown();
    genHeadline.innerHTML = 'Pokemon Generationen (National Index)';
    load1.innerHTML = 'Ab der Roten und der Blauen Edition (1-151)';
    load2.innerHTML = 'Ab der Goldenen und Silbernen Edition (152-251)';
    load3.innerHTML = 'Ab der Rubin und Saphir-Edition (252-386)';
    load4.innerHTML = 'Ab der Diamant und Perl-Edition (387-493)';
    load5.innerHTML = 'Ab der Schwarzen und Weißen Edition (494-649)';
    load6.innerHTML = 'Ab X und Y (650-721)';
    load7.innerHTML = 'Ab Sonne und Mond (722-802)';
    load8.innerHTML = 'Ab Ultrasonne und Ultramond (803-807)';
    load9.innerHTML = 'Ab Pokémon Let\'s Go (808-809)';
    load10.innerHTML = 'Ab Schwert und Schild (810-898)';
    load11.innerHTML = 'Ab Pokémon Legenden: Arceus (899-905)';
    load12.innerHTML = 'Ab Pokémon Legenden: Karmesin und Purpur (906-1017)';
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


function getHTMLElementsDropdown() {
    return {
        genHeadline: document.getElementById('gene-headline'),
        load1: document.getElementById('load-1'),
        load2: document.getElementById('load-2'),
        load3: document.getElementById('load-3'),
        load4: document.getElementById('load-4'),
        load5: document.getElementById('load-5'),
        load6: document.getElementById('load-6'),
        load7: document.getElementById('load-7'),
        load8: document.getElementById('load-8'),
        load9: document.getElementById('load-9'),
        load10: document.getElementById('load-10'),
        load11: document.getElementById('load-11'),
        load12: document.getElementById('load-12')
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
        typeTranslationOne(string, span);
        typeTranslationTwo(string, span);
        typeTranslationThree(string, span);
        typeTranslationFour(string, span);
        typeTranslationFive(string, span);
    }
}


function typeTranslationOne(string, span) {
    if (string.includes('Water')) {
        span.innerHTML = 'Wasser';
        return;
    }
    if (string.includes('Grass')) {
        span.innerHTML = 'Pflanze';
        return;
    }
    if (string.includes('Fire')) {
        span.innerHTML = 'Feuer';
        return;
    }
    if (string.includes('Ground')) {
        span.innerHTML = 'Boden';
        return;
    }
}


function typeTranslationTwo(string, span) {
    if (string.includes('Bug')) {
        span.innerHTML = 'Käfer';
        return;
    }
    if (string.includes('Steel')) {
        span.innerHTML = 'Stahl';
        return;
    }
    if (string.includes('Dark')) {
        span.innerHTML = 'Unlicht';
        return;
    }
    if (string.includes('Flying')) {
        span.innerHTML = 'Fliegen';
        return;
    }
}


function typeTranslationThree(string, span) {
    if (string.includes('Poison')) {
        span.innerHTML = 'Gift';
        return;
    }
    if (string.includes('Ghost')) {
        span.innerHTML = 'Geist';
        return;
    }
    if (string.includes('Dragon')) {
        span.innerHTML = 'Drache';
        return;
    }
    if (string.includes('Electric')) {
        span.innerHTML = 'Elektrizität';
        return;
    }
}


function typeTranslationFour(string, span) {
    if (string.includes('Fighting')) {
        span.innerHTML = 'Kampf';
        return;
    }
    if (string.includes('Fairy')) {
        span.innerHTML = 'Fee';
        return;
    }
    if (string.includes('Ice')) {
        span.innerHTML = 'Eis';
        return;
    }
    if (string.includes('Rock')) {
        span.innerHTML = 'Stein';
        return;
    }
}


function typeTranslationFive(string, span) {
    if (string.includes('Psychic')) {
        span.innerHTML = 'Psycho';
    }
    if (string.includes('Normal')) {
        span.innerHTML = 'Normal';
    }
}
