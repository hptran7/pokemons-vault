import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pokemon } from "../utils/type";
import { NavLink, useHistory } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import RadarChart from "react-svg-radar-chart";
import "react-svg-radar-chart/build/css/index.css";

export interface pokemonStats {
  Attack: number;
  Defense: number;
  SpAttack: number;
  SpDefense: number;
  Speed: number;
  HP: number;
}

function PokemonCompared() {
  const [autoCompleteSearch1, setAutoCompleteSearch1] = useState<Pokemon[]>();
  const [autoCompleteSearch2, setAutoCompleteSearch2] = useState<Pokemon[]>();
  const [searchPokemonName1, setSearchPokemonName1] = useState<string>();
  const [searchPokemonName2, setSearchPokemonName2] = useState<string>();
  const [pokemonDetail1, setPokemonDetail1] = useState<Pokemon>();
  const [pokemonDetail2, setPokemonDetail2] = useState<Pokemon>();
  const [pokemonWeaknesses1, setPokemonWeaknesses1] = useState<string[]>();
  const [pokemonWeaknesses2, setPokemonWeaknesses2] = useState<string[]>();
  const [pokemonRadarStat1, setPokemonRadarStats1] = useState<pokemonStats>();
  const [pokemonRadarStat2, setPokemonRadarStats2] = useState<pokemonStats>();
  const history = useHistory();
  let pokemonSearchList1;
  let pokemonSearchList2;

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setAutoCompleteSearch1([]);
      autoCompleteFetch(searchPokemonName1, 1);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchPokemonName1]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setAutoCompleteSearch2([]);
      autoCompleteFetch(searchPokemonName2, 2);
    }, 500);
    return () => clearTimeout(timeOutId);
  }, [searchPokemonName2]);

  const autoCompleteFetch = (name: string | undefined, nchild: number) => {
    if (!name) {
      return;
    }
    axios({
      url: "https://lit-forest-29386.herokuapp.com/graphql",
      method: "post",
      data: {
        query: `query{
                PokemonSearch(name:"${name}"){
                    name
                    img
                  }
             }`,
      },
    })
      .then((res) => {
        if (nchild === 1) {
          setAutoCompleteSearch1(res.data.data.PokemonSearch);
        } else if (nchild === 2) {
          setAutoCompleteSearch2(res.data.data.PokemonSearch);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleOnchange = (
    event: React.ChangeEvent<HTMLInputElement>,
    nchild: number
  ) => {
    if (nchild === 1) {
      setSearchPokemonName1(event.target.value);
    }
    if (nchild === 2) {
      setSearchPokemonName2(event.target.value);
    }
  };

  const handleOnKeyEnter = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nchild: number
  ) => {
    if (event.key === "Enter") {
      if (nchild === 1) {
        if (searchPokemonName1) fetchPokemon(searchPokemonName1, nchild);
        setSearchPokemonName1("");
      }
      if (nchild === 2) {
        if (searchPokemonName2) fetchPokemon(searchPokemonName2, nchild);
        setSearchPokemonName2("");
      }
    }
  };

  const handleOnSearch = (nchild: number) => {
    if (nchild === 1) {
      if (searchPokemonName1) fetchPokemon(searchPokemonName1, nchild);
      setSearchPokemonName1("");
    }
    if (nchild === 2) {
      if (searchPokemonName2) fetchPokemon(searchPokemonName2, nchild);
      setSearchPokemonName2("");
    }
  };
  let weaknessList1;
  if (pokemonWeaknesses1) {
    weaknessList1 = pokemonWeaknesses1.map((weakness, i) => {
      return (
        <div key={weakness}>
          <div className={"weakness-wrapper" + " " + weakness}>
            <p className="weakness-name">{weakness}</p>
          </div>
        </div>
      );
    });
  }
  let weaknessList2;
  if (pokemonWeaknesses2) {
    weaknessList2 = pokemonWeaknesses2.map((weakness, i) => {
      return (
        <div key={weakness}>
          <div className={"weakness-wrapper" + " " + weakness}>
            <p className="weakness-name">{weakness}</p>
          </div>
        </div>
      );
    });
  }

  const fetchPokemon = (pokemonName: string, nchild: number) => {
    if (!pokemonName) {
      return;
    }
    axios({
      url: "https://lit-forest-29386.herokuapp.com/graphql",
      method: "post",
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
         }`,
      },
    })
      .then((result) => {
        if (!result.data.data.Pokemon) {
          return;
        } else {
          if (nchild === 1) {
            setPokemonDetail1(result.data.data.Pokemon);
            // const chartData = setChartData(result.data.data.Pokemon.base)
            setPokemonWeaknesses1(result.data.data.Pokemon.weaknesses);
            setPokemonRadarStats1(result.data.data.Pokemon.base);
          }
          if (nchild === 2) {
            setPokemonDetail2(result.data.data.Pokemon);
            // const chartData = setChartData(result.data.data.Pokemon.base)
            setPokemonWeaknesses2(result.data.data.Pokemon.weaknesses);
            setPokemonRadarStats2(result.data.data.Pokemon.base);
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  let pokemonRadarStat = [
    {
      data: {
        Attack: 0,
        Defense: 0,
        SpAttack: 0,
        SpDefense: 0,
        Speed: 0,
        HP: 0,
      },
      meta: { color: "blue" },
    },
    {
      data: {
        Attack: 0,
        Defense: 0,
        SpAttack: 0,
        SpDefense: 0,
        Speed: 0,
        HP: 0,
      },
      meta: { color: "red" },
    },
  ];
  if (pokemonRadarStat1 && pokemonRadarStat2) {
    pokemonRadarStat = [
      {
        data: {
          Attack: pokemonRadarStat1.Attack / 134,
          Defense: pokemonRadarStat1.Defense / 180,
          SpAttack: pokemonRadarStat1.SpAttack / 154,
          SpDefense: pokemonRadarStat1.SpDefense / 125,
          Speed: pokemonRadarStat1.Speed / 150,
          HP: pokemonRadarStat1.HP / 250,
        },
        meta: { color: "blue" },
      },
      {
        data: {
          Attack: pokemonRadarStat2.Attack / 134,
          Defense: pokemonRadarStat2.Defense / 180,
          SpAttack: pokemonRadarStat2.SpAttack / 154,
          SpDefense: pokemonRadarStat2.SpDefense / 125,
          Speed: pokemonRadarStat2.Speed / 150,
          HP: pokemonRadarStat2.HP / 250,
        },
        meta: { color: "red" },
      },
    ];
  }
  const captions = {
    // columns
    Attack: "Attack",
    Defense: "Defense",
    SpAttack: "SpAttack",
    SpDefense: "SpDefense",
    Speed: "Weight",
    HP: "HP",
  };

  if (autoCompleteSearch1 || autoCompleteSearch2) {
    if (autoCompleteSearch1) {
      if (searchPokemonName1) {
        pokemonSearchList1 = autoCompleteSearch1.map((pokemon, index) => {
          return (
            <div key={index}>
              <div
                className="search-result-items"
                onClick={() => {
                  setSearchPokemonName1("");
                  fetchPokemon(pokemon.name, 1);
                }}
              >
                <img src={pokemon.img} className="search-items-img"></img>
                <div>{pokemon.name}</div>
              </div>
            </div>
          );
        });
      }
    }
    if (autoCompleteSearch2) {
      if (searchPokemonName2) {
        pokemonSearchList2 = autoCompleteSearch2.map((pokemon, index) => {
          return (
            <div key={index}>
              <div
                className="search-result-items"
                onClick={() => {
                  setSearchPokemonName2("");
                  fetchPokemon(pokemon.name, 2);
                }}
              >
                <img src={pokemon.img} className="search-items-img"></img>
                <div>{pokemon.name}</div>
              </div>
            </div>
          );
        });
      }
    }
  }
  return (
    <div>
      <div className="App">
        <div className="detail-page-container">
          <div className="compared-page-wrapper">
            <div className="pokemon-compare-1">
              <div className="center overlay">
                <div className="wrapper">
                  <div className="search-input">
                    <input
                      type="test"
                      placeholder="Pokemon Name"
                      onChange={(e) => {
                        handleOnchange(e, 1);
                      }}
                      onKeyPress={(e) => {
                        handleOnKeyEnter(e, 1);
                      }}
                    ></input>
                    <div className="autocom-box">{pokemonSearchList1}</div>
                    <div className="icon">
                      <FaIcons.FaSearch onClick={() => handleOnSearch(1)} />
                    </div>
                  </div>
                </div>
              </div>
              {pokemonDetail1 ? (
                <div className="pokemon-detail-bottom">
                  <div className="pokemon-compared-detail">
                    <div className="detail-right">
                      <div className="detail-img">
                        <img
                          src={pokemonDetail1.img}
                          className="pokemon-pic"
                        ></img>
                      </div>
                      <div className="weaknesses">
                        <h3>Weaknesses</h3>
                        <div className="weakness-list">{weaknessList1}</div>
                      </div>
                    </div>
                    <div className="detail-left">
                      <h2>{pokemonDetail1.name}</h2>
                      <div className="basic-stats">
                        <div className="basic-left">
                          <div className="card-info">
                            <div className="card-info-left">
                              <span className="attribute-title">Height</span>
                              <span className="attribute-value">
                                {pokemonDetail1.height}
                              </span>
                              <span className="attribute-title">Weight</span>
                              <span className="attribute-value">
                                {pokemonDetail1.weight}
                              </span>
                              <span className="attribute-title">Type</span>
                              <span className="attribute-value">
                                {pokemonDetail1.type}
                              </span>
                            </div>
                            <div className="card-info-right">
                              <span className="attribute-title">Rank</span>
                              <span className="attribute-value">
                                {pokemonDetail1.rank}
                              </span>
                              <span className="attribute-title">Gender</span>
                              <span className="attribute-value"></span>
                            </div>
                          </div>
                        </div>
                        <div className="basic-right"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="pokemon-compare-1">
              <div className="center overlay">
                <div className="wrapper">
                  <div className="search-input">
                    <input
                      type="test"
                      placeholder="Pokemon Name"
                      onChange={(e) => {
                        handleOnchange(e, 2);
                      }}
                      onKeyPress={(e) => {
                        handleOnKeyEnter(e, 2);
                      }}
                    ></input>
                    <div className="autocom-box">{pokemonSearchList2}</div>
                    <div className="icon">
                      <FaIcons.FaSearch onClick={() => handleOnSearch(2)} />
                    </div>
                  </div>
                </div>
              </div>
              {pokemonDetail2 ? (
                <div className="pokemon-detail-bottom">
                  <div className="pokemon-compared-detail">
                    <div className="detail-right">
                      <div className="detail-img">
                        <img
                          src={pokemonDetail2.img}
                          className="pokemon-pic"
                        ></img>
                      </div>
                      <div className="weaknesses">
                        <h3 style={{ color: "red" }}>Weaknesses</h3>
                        <div className="weakness-list">{weaknessList2}</div>
                      </div>
                    </div>
                    <div className="detail-left">
                      <h2 style={{ color: "red" }}>{pokemonDetail2.name}</h2>
                      <div className="basic-stats">
                        <div className="basic-left">
                          <div className="card-info">
                            <div className="card-info-left">
                              <span className="attribute-title">Height</span>
                              <span className="attribute-value">
                                {pokemonDetail2.height}
                              </span>
                              <span className="attribute-title">Weight</span>
                              <span className="attribute-value">
                                {pokemonDetail2.weight}
                              </span>
                              <span className="attribute-title">Type</span>
                              <span className="attribute-value">
                                {pokemonDetail2.type}
                              </span>
                            </div>
                            <div className="card-info-right">
                              <span className="attribute-title">Rank</span>
                              <span className="attribute-value">
                                {pokemonDetail2.rank}
                              </span>
                              <span className="attribute-title">Gender</span>
                              <span className="attribute-value"></span>
                            </div>
                          </div>
                        </div>
                        <div className="basic-right"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          <div className="radar-chart">
            {pokemonRadarStat1 &&
            pokemonRadarStat2 &&
            pokemonDetail1 &&
            pokemonDetail2 ? (
              <div>
                <div>
                <div className="chart-show">
                  <RadarChart
                    captions={captions}
                    data={pokemonRadarStat}
                    size={250}
                  />
                </div>
                </div>
                <div>
                <div className="radar-chart-detail">
                <div className="pokemon-stats-left">
                  <h3>{pokemonDetail1.name}</h3>
                  <div className="compared-page-wrapper">
                    <div>Attack:</div>
                    <div style={{ color: "blue" }}>
                      {" "}
                      {pokemonRadarStat1.Attack}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>Defense:</div>
                    <div style={{ color: "blue" }}>
                      {" "}
                      {pokemonRadarStat1.Defense}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>SpAttack:</div>
                    <div style={{ color: "blue" }}>
                      {" "}
                      {pokemonRadarStat1.SpAttack}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>SpDefense:</div>
                    <div style={{ color: "blue" }}>
                      {" "}
                      {pokemonRadarStat1.SpDefense}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>Speed:</div>
                    <div style={{ color: "blue" }}>
                      {" "}
                      {pokemonRadarStat1.Speed}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>HP:</div>
                    <div style={{ color: "blue" }}> {pokemonRadarStat1.HP}</div>
                  </div>
                </div>
                <div className="hidden">
                  <RadarChart
                    captions={captions}
                    data={pokemonRadarStat}
                    size={250}
                  />
                </div>
                <div className="pokemon-stats-right">
                  <h3 style={{ color: "red" }}>{pokemonDetail2.name}</h3>
                  <div className="text-hidden">
                    <div className="float-right compared-page-wrapper">
                      <div style={{ color: "red" }}>
                        {" "}
                        {pokemonRadarStat2.Attack}{" "}
                      </div>
                      <div> :Attack</div>
                    </div>
                    <div className="compared-page-wrapper float-right">
                      <div style={{ color: "red" }}>
                        {" "}
                        {pokemonRadarStat2.Defense}
                      </div>
                      <div> :Defense</div>
                    </div>
                    <div className="compared-page-wrapper float-right">
                      <div style={{ color: "red" }}>
                        {" "}
                        {pokemonRadarStat2.SpAttack}
                      </div>
                      <div> :SpAttack</div>
                    </div>
                    <div className="compared-page-wrapper float-right">
                      <div style={{ color: "red" }}>
                        {" "}
                        {pokemonRadarStat2.SpDefense}
                      </div>
                      <div> :SpDefense</div>
                    </div>
                    <div className="compared-page-wrapper float-right">
                      <div style={{ color: "red" }}>
                        {" "}
                        {pokemonRadarStat2.Speed}
                      </div>
                      <div> :Speed</div>
                    </div>
                    <div className="compared-page-wrapper float-right">
                      <div style={{ color: "red" }}>
                        {" "}
                        {pokemonRadarStat2.HP}
                      </div>
                      <div> :HP</div>
                    </div>
                  </div>
                  <div className="text-show">
                  <div className="compared-page-wrapper">
                    <div>Attack:</div>
                    <div style={{ color: "red" }}>
                      {" "}
                      {pokemonRadarStat2.Attack}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>Defense:</div>
                    <div style={{ color: "red" }}>
                      {" "}
                      {pokemonRadarStat2.Defense}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>SpAttack:</div>
                    <div style={{ color: "red" }}>
                      {" "}
                      {pokemonRadarStat2.SpAttack}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>SpDefense:</div>
                    <div style={{ color: "red" }}>
                      {" "}
                      {pokemonRadarStat2.SpDefense}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>Speed:</div>
                    <div style={{ color: "red" }}>
                      {" "}
                      {pokemonRadarStat2.Speed}
                    </div>
                  </div>
                  <div className="compared-page-wrapper">
                    <div>HP:</div>
                    <div style={{ color: "red" }}> {pokemonRadarStat2.HP}</div>
                  </div>
                  </div>
                </div>
                </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonCompared;
