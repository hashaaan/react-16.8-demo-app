import React, { useState, Suspense } from "react";
//import { ustable_createResource as createResource } from "react-cache";
import fetchPokemon from "./fetch-pokemon";
// import { read } from "fs";

const cache = {};

function createResource(fn) {
  return {
    read(id) {
      const data = cache[id];
      if (!data) {
        const promise = fn(id).then(p => (cache[id] = p));
        throw promise;
      }
      return data;
    }
  };
}

const myPokemon = createResource(fetchPokemon);

function PokemonInfo({ pokemonName }) {
  const pokemon = myPokemon.read(pokemonName);
  // const pokemon = { pokemonName };
  // const pokemon = cache[pokemonName];
  // if (!pokemon) {
  //   const promise = fetchPokemon(pokemonName).then(
  //     p => (cache[pokemonName] = p)
  //   );
  //   throw promise;
  // }
  return <pre>{JSON.stringify(pokemon || "Unknown", null, 2)}</pre>;
}

function App() {
  const [pokemonName, setPokemonName] = useState(null);
  function handleSubmit(e) {
    e.preventDefault();
    setPokemonName(e.target.elements.pokemonName.value);
  }
  return (
    <div className="form mt-10">
      <form onSubmit={handleSubmit}>
        <label htmlFor="pokemonName-input">
          Pokemon Name (ie: Pikachu, Mew, Snorlax, Eevee)
        </label>
        <input
          type="text"
          id="pokemonName-input"
          name="pokemonName"
          autoFocus
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      {pokemonName ? (
        <Suspense fallback={<div className="loader">Loading...</div>}>
          <PokemonInfo pokemonName={pokemonName} />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
