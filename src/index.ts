import express from "express";
import { ApiRoot } from "./interfaces";
import { Stats } from "node:fs";
const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


app.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;
    if (!pokemonName) {
        return res.status(400).json({ error: 'Nombre de Pokémon requerido' });
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
        const response = await fetch(url);

        if (response.status === 404) {
            return res.status(404).json({ error: 'Pokemon no existe' })
        }

        const data = (await response.json()) as ApiRoot;

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();
        const  dataNorm = {
            name: data.name,
            id: data.id,
            types: data.types.map((t: any) => t.type.name).sort(),
            baseStats: {
                hp: data.stats[0]?.base_stat,
                attack: data.stats[1]?.base_stat,
                defense: data.stats[2]?.base_stat,
                specialAttack: data.stats[3]?.base_stat,
                specialDefense: data.stats[4]?.base_stat,
                speed: data.stats[5]?.base_stat,
                totalStats: data.stats.reduce((acumulador: number, statActual: any) => acumulador + statActual.base_stat, 0)}}

        res.json(dataNorm);

    } catch (error) {
        return res.status(502).json({ error: 'Falla una dependencia externa clave' });
    }
});


app.get("/battle/:pokemon1/:pokemon2", async (req, res) => {
    const pokemon1 = req.params.pokemon1;
    const pokemon2 = req.params.pokemon2;

    if (!pokemon1 || !pokemon2) {
        return res.status(400).json({ error: 'Nombre de Pokémon requerido' });
    }

    const url1 = `http://localhost:3000/pokemon/${pokemon1}`;
    const url2 = `http://localhost:3000/pokemon/${pokemon2}`;


    try {

        const response1 = await fetch(url1);
        const response2 = await fetch(url2);


        if (response1.status === 404) {
            return res.status(404).json({ error: 'Pokemon1 no existe' })
        }

        if (response2.status === 404) {
            return res.status(404).json({ error: 'Pokemon2 no existe' })
        }

        const data1 = (await response1.json());
        const data2 = (await response2.json());

           const battleScore1 = Number(((data1.hp*0.20)+
            (data1.attack*0.25)+
            (data1.defense*0.15)+
            (data1.specialAttack*0.20)+
            (data1.specialDefense*0.10)+
            (data1.speed*0.10))).toFixed(2)
         ;

            const battleScore2 = Number(((data2.hp*0.20)+
            (data2.attack*0.25)+
            (data2.defense*0.15)+
            (data2.specialAttack*0.20)+
            (data2.specialDefense*0.10)+
            (data2.speed*0.10))).toFixed(2)
         ;

        
        
        res.json({ data1,battleScore1, data2,  battleScore2});

    } catch (error) {
        return res.status(502).json({ error: 'Falla una dependencia externa clave' });
    }

})