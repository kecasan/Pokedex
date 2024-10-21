const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonTypes = document.querySelector('.pokemon__types');
const pokemonAbilities = document.querySelector('.pokemon__abilities');
const pokemonEvolutions = document.querySelector('.pokemon__evolutions');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;


const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
};


const fetchEvolutionChain = async (pokemonId) => {
  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
  const speciesData = await speciesResponse.json();
  
  const evolutionResponse = await fetch(speciesData.evolution_chain.url);
  const evolutionData = await evolutionResponse.json();
  
  return evolutionData;
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


    const types = data.types.map(typeInfo => typeInfo.type.name).join(', ');
    pokemonTypes.innerHTML = `Tipo: ${types}`;


    const abilities = data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');
    pokemonAbilities.innerHTML = `Habilidades: ${abilities}`;


    const evolutionChain = await fetchEvolutionChain(data.id);
    let evolutionNames = [];
    let currentEvolution = evolutionChain.chain;

    do {
      evolutionNames.push(currentEvolution.species.name);
      currentEvolution = currentEvolution.evolves_to[0];
    } while (currentEvolution);

    pokemonEvolutions.innerHTML = `Evoluções: ${evolutionNames.join(' -> ')}`;
    
  } else {

    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
    pokemonTypes.innerHTML = '';
    pokemonAbilities.innerHTML = '';
    pokemonEvolutions.innerHTML = '';
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
