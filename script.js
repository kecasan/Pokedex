const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonTypes = document.querySelector('.pokemon__types');
const pokemonAbilities = document.querySelector('.pokemon__abilities');
const pokemonEvolutions = document.querySelector('.pokemon__evolutions');
const pokemonDescription = document.querySelector('.pokemon__description');
const pokemonHabitat = document.querySelector('.pokemon__habitat');
const pokemonColor = document.querySelector('.pokemon__color');
const pokemonStats = document.querySelector('.pokemon__stats');
const pokemonMoves = document.querySelector('.pokemon__moves');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (APIResponse.status === 200) {
            const data = await APIResponse.json();
            return data;
        } else {
            throw new Error('Pokémon not found');
        }
    } catch (error) {
        console.error(error);
        pokemonName.innerHTML = 'Erro: ' + error.message;
        pokemonImage.style.display = 'none';
    }
};

const fetchEvolutionChain = async (pokemonId) => {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const speciesData = await speciesResponse.json();
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();
    return evolutionData;
};

const fetchPokemonDetails = async (pokemonId) => {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const speciesData = await speciesResponse.json();
    return {
        habitat: speciesData.habitat ? speciesData.habitat.name : 'Desconhecido',
        color: speciesData.color.name,
        description: speciesData.flavor_text_entries.find((entry) => entry.language.name === 'pt')?.flavor_text || 'Nenhuma descrição disponível',
    };
};

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'];
        input.value = '';
        searchPokemon = data.id;

        pokemonTypes.innerHTML = `Tipo: ${data.types.map((typeInfo) => typeInfo.type.name).join(', ')}`;
        pokemonAbilities.innerHTML = `Habilidades: ${data.abilities.map((abilityInfo) => abilityInfo.ability.name).join(', ')}`;

        const evolutionChain = await fetchEvolutionChain(data.id);
        let evolutionNames = [];
        let currentEvolution = evolutionChain.chain;
        do {
            evolutionNames.push(currentEvolution.species.name);
            currentEvolution = currentEvolution.evolves_to[0];
        } while (currentEvolution);
        pokemonEvolutions.innerHTML = `Evoluções: ${evolutionNames.join(' -> ')}`;

        const details = await fetchPokemonDetails(data.id);
        pokemonDescription.innerText = `Descrição: ${details.description}`;
        pokemonHabitat.innerText = `Habitat: ${details.habitat}`;
        pokemonColor.innerText = `Cor: ${details.color}`;

        // Estatísticas base
        const statsHTML = data.stats
            .map(stat => `<p>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</p>`)
            .join('');
        pokemonStats.innerHTML = statsHTML;

        // Movimentos
        const movesHTML = data.moves
            .map(move => `<p>${move.move.name}</p>`)
            .slice(0, 10) // Limite de movimentos
            .join('');
        pokemonMoves.innerHTML = movesHTML;

    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
        pokemonTypes.innerHTML = '';
        pokemonAbilities.innerHTML = '';
        pokemonEvolutions.innerHTML = '';
        pokemonDescription.innerHTML = '';
        pokemonHabitat.innerHTML = '';
        pokemonColor.innerHTML = '';
        pokemonStats.innerHTML = '';
        pokemonMoves.innerHTML = '';
    }
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);

function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach((tab) => (tab.style.display = 'none'));
    document.getElementById(tabName).style.display = 'block';
}

function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
}