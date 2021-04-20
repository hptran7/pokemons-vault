import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pokemon, PokemonBaseStats } from "../utils/type";
import axios from "axios"
import RadarChart from 'react-svg-radar-chart';
import 'react-svg-radar-chart/build/css/index.css'

export interface ParamTypes {
  pokemonName: string
}


function PokemonDetail() {
  const pokemonName = useParams<ParamTypes>().pokemonName;
  const [pokemonDetail, setPokemonDetail] = useState<Pokemon>();
  const [pokemonWeaknesses, setPokemonWeaknesses] = useState<string[]>()
  const [pokemonRadarStat, setPokemonRadarStats]= useState<any[]>([{
    data: {
      Attack: 0.0,
      Defense: 0.0,
      SpAttack: 0.0,
      SpDefense: 0.0,
      Speed: 0.0,
      HP:0.0
    },
    meta: { color: 'blue' }
  },
])
  useEffect(() => {
    axios({
      url: 'https://lit-forest-29386.herokuapp.com/graphql',
      method: 'post',
      data: {
       query: `query{
        Pokemon(name:"${pokemonName}"){
          name
          img
          type
          height
          weight
          weaknesses
          rank
          base{
            HP
            Attack
            Defense
            SpAttack
            SpDefense
            Speed
          }
        }
       }`
      }
     }).then((result)=>{
       if(!result.data.data.Pokemon){
         return
       } else{
        setPokemonDetail(result.data.data.Pokemon)
        const chartData = setChartData(result.data.data.Pokemon.base)
         setPokemonWeaknesses(result.data.data.Pokemon.weaknesses)   
        setPokemonRadarStats(chartData)
       }
     }).catch(err=>{
       throw err
     })
  }, []);

  const setChartData = (pokemonStats:PokemonBaseStats)=>{
    if(!pokemonStats){
      return [{
        data: {
          Attack: 0.0,
          Defense: 0.0,
          SpAttack: 0.0,
          SpDefense: 0.0,
          Speed: 0.0,
          HP:0.0
        },
        meta: { color: 'blue' }
      },
    ];
    }
    return [{
      data: {
        Attack: (pokemonStats.Attack/134),
        Defense: (pokemonStats.Defense/180),
        SpAttack: (pokemonStats.SpAttack/154),
        SpDefense: (pokemonStats.SpDefense/125),
        Speed: (pokemonStats.Speed/150),
        HP:(pokemonStats.HP/250)
      },
      meta: { color: 'blue' }
    },
  ];
  }


    const captions = {
    // columns
      Attack: 'Attack',
      Defense: 'Defense',
      SpAttack: 'SpAttack',
      SpDefense: 'SpDefense',
      Speed: 'Weight',
      HP:"HP"
    };
    let weaknessList
      if(pokemonWeaknesses){
         weaknessList = pokemonWeaknesses.map((weakness, i)=>{
          return (
            <div key={weakness}>
              <div className={"weakness-wrapper" + " "+ weakness}>
              <p className="weakness-name">{weakness}</p>
            </div>
            </div>

          )
        })
      }


  
  return (
    <div className="App">
      <div>
        <h1>Detail</h1>
        {pokemonDetail?(
                  <div className="short-page pokemon-detail-wrapper">
                  <div className="pokemon-detail">
                    <div className="detail-right">
                      <div className="detail-img">
                        <img src={pokemonDetail.img} className="pokemon-pic"></img>
                      </div>
                      <RadarChart
                        captions={captions}
                        data={pokemonRadarStat}
                        size={250}
                      />
                    </div>
                    <div className="detail-left">
                      <h2>{pokemonDetail.name}</h2>
                      <div className="basic-stats">
                        <div className="basic-left">
                          <div className="card-info">
                            <div className="card-info-left">
                              <span className="attribute-title">Height</span>
                              <span className="attribute-value">{pokemonDetail.height}</span>
                              <span className="attribute-title">Weight</span>
                              <span className="attribute-value">{pokemonDetail.weight}</span>
                              <span className="attribute-title">Type</span>
                              <span className="attribute-value">{pokemonDetail.type}</span>
                            </div>
                            <div className="card-info-right">
                              <span className="attribute-title">Rank</span>
                              <span className="attribute-value">{pokemonDetail.rank}</span>
                              <span className="attribute-title">Gender</span>
                              <span className="attribute-value"></span>
                            </div>
                          </div>
                          <div className="weaknesses">
                            <h3>Weaknesses</h3>
                            <div className="weakness-list">
                                {weaknessList}
                            </div>
                          </div>
                        </div>
                        <div className="basic-right"></div>
                      </div>
                    </div>
                  </div>
                  </div>
        ):<h3>This pokemon is not found</h3>}       
      </div>
    </div>
  );
}

export default PokemonDetail;
