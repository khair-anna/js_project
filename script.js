const characterList = document.getElementById('character_list');
const characterDetails = document.getElementById('character_details');
const nameField = document.getElementById('name');
const birthYearField = document.getElementById('birth_year');
const genderField = document.getElementById('gender');
const filmsField = document.getElementById('films');
const planetField = document.getElementById('planet');
const speciesField = document.getElementById('species');
const btnBackToList = document.getElementById('back_to_list');
const btnPrevious = document.getElementById('btn_previous');
const btnNext = document.getElementById('btn_next');
const characterHeader = document.getElementById('character_header');


let currentPage = 1;
let characters = [];

async function fetchCharacter(page) {
    try {
        const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
        const data = await response.json();
        characters = data.results;
        btnPrevious.style.display = page > 1 ? 'block' : 'none';
        btnNext.style.display = data.next ? 'block' : 'none';

        console.log(characters);
        createCharacterList();
    } catch (error){
        console.error(error);
    }
}

function createCharacterList() {
    characterList.innerHTML = '';

    characters.forEach(character => {
        const listItem = document.createElement('div');
        listItem.classList.add('character_item');
        listItem.innerHTML = `<a href="#" class="character_link">${character.name}</a>`;
        characterList.appendChild(listItem);
    });

    document.querySelectorAll('.character_item').forEach((link, index) => {
        link.addEventListener('click', function () {
            showCharacterDetails(index);
        })
    })
}

function showCharacterDetails(index) {
    characterList.style.display = "none";
    characterDetails.style.display = "block";
    btnPrevious.style.display = 'none';
    btnNext.style.display = 'none';
    characterHeader.style.display = 'none';

    const character = characters[index];
    nameField.innerHTML = character.name;
    birthYearField.innerHTML = character.birth_year;
    genderField.innerHTML = character.gender;

    getFilms(character);
    filmsField.innerHTML = '';
    
    getHomeWorld(character);
    planetField.innerHTML = '';

    getSpecies(character);
}

async function getFilms(character) {
    character.films.forEach(film => {
        fetch(`${film}`)
            .then(response => response.json())
            .then(data => {
                filmsField.innerHTML += `<li>${data.title}</li>`;
            });
    })
}

async function getHomeWorld(character) {
    fetch(`${character.homeworld}`)
        .then(response => response.json())
        .then(data => {
            planetField.innerHTML = data.name;
        })
}

async function getSpecies(character) {
    if (character.species.length > 0) {
        fetch(`${character.species}`)
            .then(response => response.json())
            .then(data => {
                speciesField.innerHTML = data.name;
            })
    } else {
        speciesField.innerHTML = 'Unknown';
    }
}


btnBackToList.addEventListener('click', function () {
    characterList.style.display = "grid";
    characterDetails.style.display = "none";
    btnPrevious.style.display = 'block';
    btnNext.style.display = 'block';
    characterHeader.style.display = 'block';
})

btnNext.addEventListener('click', function () {
    currentPage++;
    fetchCharacter(currentPage);
})

btnPrevious.addEventListener('click', function () {
    currentPage--;
    fetchCharacter(currentPage);
})

fetchCharacter(currentPage);




