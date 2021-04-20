import React, {useEffect, useState} from 'react'
import axios from "axios"
import { NavLink, useHistory } from "react-router-dom";
import {Pokemon} from "../utils/type"
import * as FaIcons from "react-icons/fa";




const selectColor = (type:string)=>{
    let pokemonType = type.toLocaleLowerCase()
    switch (pokemonType){
        case "fire":
            return '#FDDFDF';
        case "grass":
            return '#DEFDE0';
        case "electric":
            return '#FCF7DE';
        case "water":
            return '#DEF3FD';
        case "ground":
            return '#f4e7da';
        case "rock":
            return '#d5d5d4';
        case "fairy":
            return '#fceaff';
        case "poison":
            return '#98d7a5';
        case "bug":
            return '#f8d5a3';
        case "dragon" :
            return '#97b3e6';
        case "psychic":
            return '#eaeda1';
        case "flying":
            return '#F5F5F5';
        case "fighting":
            return '#E6E0D4';
        case "normal":
            return '#F5F5F5';
    }
}

function MainPage() {
    const [allPokemon, setAllPokemon] = useState<Pokemon[]>()
    const [autoCompleteSearch, setAutoCompleteSearch] = useState<Pokemon[]>()
    const [searchPokemonName, setSearchPokemonName]= useState<string>()
    let pokemonList
    let pokemonSearchList
    const history = useHistory()
    useEffect(()=>{
     axios({
        url: 'https://lit-forest-29386.herokuapp.com/graphql',
        method: 'post',
        data: {
         query: `query{
            Pokemons{
                _id
                name
                img
                type
              }
         }`
        }
       })
        .then(res => {
            setAllPokemon(res.data.data.Pokemons)
        })
        .catch(err => {
         console.log(err.message);
        });
},[])

useEffect(() => {
    const timeOutId = setTimeout(() => {
        setAutoCompleteSearch([])
        autoCompleteFetch(searchPokemonName)
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchPokemonName]);

const autoCompleteFetch = (name:string | undefined)=>{
    if(!name){
        return
    }
    axios({
        url: 'https://lit-forest-29386.herokuapp.com/graphql',
        method: 'post',
        data: {
         query: `query{
            PokemonSearch(name:"${name}"){
                name
                img
              }
         }`
        }
       })
        .then(res => {
         setAutoCompleteSearch(res.data.data.PokemonSearch)
         console.log(res)
        })
        .catch(err => {
         console.log(err.message);
        });
}
const handleOnchange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    setSearchPokemonName(event.target.value)
    
}
const handleOnKeyEnter = (event:React.KeyboardEvent<HTMLInputElement>)=>{
    if(event.key=== "Enter"){
        history.push(`/${searchPokemonName}`)
    }
}
const handleOnSearch = ()=>{
    history.push(`/${searchPokemonName}`)
}
if(allPokemon){
    
    pokemonList = allPokemon.map((pokemon)=>{
        const color = selectColor(pokemon.type)
        return(
            <div className="pokemon" key={pokemon._id} style={{backgroundColor:color}}>
                <div className="img-container">
                    <img src={pokemon.img}></img>
                </div>
                <div className="info">
                    <NavLink to={pokemon.name}>
                      <h3 className="name">{pokemon.name}</h3>
                    </NavLink>
                    
                    <small className="type">Type: {pokemon.type}</small>
                </div>
            </div>
        )
    })

}
if(autoCompleteSearch){
    if(searchPokemonName){
        pokemonSearchList = autoCompleteSearch.map((pokemon,index)=>{
            return(
                <div key={index}><NavLink className="search-result-items" to={pokemon.name} style={{ textDecoration: 'none' }}>
                    <img src={pokemon.img} className="search-items-img"></img>
                    <div>{pokemon.name}</div>
                    </NavLink></div>
            )
        })
    } 
}
    return (
        <div>
            <h1>Pokemon</h1>
            <div className="center">
            <div className="wrapper">
                <div className="search-input">
                <input type="test" placeholder="Pokemon Name" onChange={(e)=>{handleOnchange(e)}} onKeyPress={(e)=>{handleOnKeyEnter(e)}}></input>
                <div className="autocom-box">
                    {pokemonSearchList}
                </div>
                <div className="icon">
                    <FaIcons.FaSearch onClick={()=>handleOnSearch()}/>
                </div>
                </div>
            </div>
            </div>

            <div className="poke-container">
                {pokemonList}
            </div>
        </div>
    )
}

export default MainPage
