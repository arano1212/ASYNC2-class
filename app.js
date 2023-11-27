

class ApiRequests {
  constructor(apikey) {
    this.apiKey = apikey;
  }

  async getPokemon(nombrePokemon) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon.toLowerCase()}`);
      if (!response.ok) {
        throw new Error(`No se puede obtener información del Pokémon "${nombrePokemon}"`);
      }
      const data = await response.json();
      const typesPokemon = data.types.map(tipo => tipo.type.name);

      console.log(`Tipos de ${nombrePokemon.charAt(0).toUpperCase() + nombrePokemon.slice(1)}:`)
      typesPokemon.forEach(tipo => {
        console.log(`---${tipo}---`);
        console.log(`--------------`)
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  async getAuthor(nameBook) {
    const title = encodeURIComponent(nameBook);
    const response = await fetch(`http://openlibrary.org/search.json?title=${title}`);
    const data = await response.json();

    if (data.docs.length > 0 && data.docs[0].author_name) {
      const authors = data.docs[0].author_name;

      console.log(`Autores del libro "${nameBook}": ${authors.join(", ")}`);
      console.log(`------------------`);

    } else {
      console.log(`No se encontraron autores para el libro ${nameBook}`);
    }
  }


  async getBooks(nameAuthor) {
    try {
      const Author = encodeURIComponent(nameAuthor);
      const response = await fetch(`http://openlibrary.org/search.json?author=${Author}`);
      const data = await response.json();

      if (data.docs.length > 0) {
        console.log(`Libros del autor "${nameAuthor}":`);
        data.docs.forEach(book => {
          console.log(`------------------`);
          console.log(book.title);
          console.log(`------------------`);
        })
      } else {
        console.log(`No se encuentran libros para el autor ${nameAuthor}`);
      }
    } catch (error) {
      console.error(error.message);
    }

  }

  async getGenereBand(nameBand) {
    const band = encodeURIComponent(nameBand);
    const response = await fetch(`https://www.theaudiodb.com/api/v1/json/2/search.php?s=${band}`);
    const data = await response.json();

    if (data.artists && data.artists.length > 0) {
      const genere = data.artists[0].strGenre;
      if (genere) {
        console.log(`---------------------`);
        console.log(`Género de la banda "${nameBand}": ${genere}`);
        console.log(`----------------------`)

      } else {
        console.log(`No se encontró información de género para la banda "${nameBand}"`);
      }

    } else {
      console.log(`No se encontró información para la banda "${nameBand}"`)
    }

  }

  async getCharacter(idCharacter) {
    const urlBase = "https://swapi.dev/api/people/";
    const url = `${urlBase}${idCharacter}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error al obtener información del personaje. Código de respuesta: ${response.status}`);
        }
        return response.json();
      })
      .then(dataCharacter => {
        console.log(`nombre del personaje: ${dataCharacter.name}`);
        console.log(`apariciones en peliculas :${dataCharacter.films.length}`);


        this.getFilms(dataCharacter.films)
      })
      .catch(error => {
        console.error(error.message)
      })

  }

  async getFilms(urlsFilms) {
    console.log(`\n *Informacion de las peliculas: `)

    const promiseFilms = urlsFilms.map(urlFilm => {
      return fetch(urlFilm)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error al obtener información de la película. Código de respuesta: ${response.status}`);
          }
          return response.json();
        })
        .then(dataFilm => {
          console.log(`  Título: ${dataFilm.title}`);
          console.log(`  Episodio: ${dataFilm.episode_id}`);
          console.log(`  Director: ${dataFilm.director}`);
          console.log("-----------");
        });
    });

    return Promise.all(promiseFilms)
  }

  async getAsteroid() {
    const apiKey = "SX3ZVvlpBfd2AhKlvvkRrySfRVngg6QsAoB56Xam";
    const baseUrl = "https://api.nasa.gov/neo/rest/v1/feed";


    const startDate = "2023-11-15";
    const endDate = "2023-11-22";


    const url = `${baseUrl}?start_date=${startDate}&end_date=${endDate}&api_key=${apiKey}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error de red - Cofigo : ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        const asteroids = data.near_earth_objects;

        for (const date in asteroids) {
          asteroids[date].forEach(asteroid => {
            if (asteroid.is_potentially_hazardous_asteroid) {
              console.log(`Asteroid ID: ${asteroid.id}`);
              console.log(`Nombre:${asteroid.name}`);
              console.log(`Fecha de aproximacion: ${date}`);
              console.log("-------------")
            }
          })
        }
      }).catch(error => {
        console.error('Error al obtener la informacion:', error.message);
      })

  }


  async getPokemons() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      if (!response.ok) {
        throw new Error(`Error al obtener información de los Pokémon. Código de respuesta: ${response.status}`);
      }

      const data = await response.json();
      const pokemons = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          if (!pokemonResponse.ok) {
            throw new Error(`Error al obtener información del Pokémon. Código de respuesta: ${pokemonResponse.status}`);
          }

          const pokemonData = await pokemonResponse.json();
          return {
            nombre: pokemonData.name,
            movimientos: pokemonData.moves.map((move) => move.move.name),
            tipos: pokemonData.types.map((type) => type.type.name),
            altura: pokemonData.height,
            peso: pokemonData.weight,
          };
        })
      );

      console.log(pokemons);
    } catch (error) {
      console.error(error.message);
    }
  }

}


const apis = new ApiRequests();

//tipo de pokemon
const nombrePokemon = "raichu";
apis.getPokemon(nombrePokemon);

//autor
apis.getAuthor('i robot');

//libros
apis.getBooks('isaac asimov');

//genero banda
apis.getGenereBand('coldplay');

//personajes
const idCharacter = 2;
apis.getCharacter(idCharacter);

//asteroides
apis.getAsteroid();

//150 pokemons
apis.getPokemons();