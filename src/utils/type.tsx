export interface PokemonBaseStats {
    HP:number,
    Attack:number,
    Defense:number,
    SpAttack:number,
    SpDefense:number,
    Speed:number,
}

export interface Pokemon{
    _id:string,
    name:string,
    img: string,
    type: string,
    height:string,
    weight:string,
    weaknesses:[string],
    rank:string,
    base:PokemonBaseStats
}