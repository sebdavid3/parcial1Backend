import express from "express";
import { ApiRoot } from "./interfaces";
const app = express();
const PORT = 3000;




app.get('/pokemon/:name', async (req, res) => {
    const pokemonName = req.params.name;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;

    try {
        const response = await fetch(url);
        if (!req.params.name) {  return res.status(400).json({ error: 'Nombre de Pokémon requerido' });}

        const data = (await response.json()) as ApiRoot;

        const dataNorm = data.

        res.json();
    
    }catch(error){
        return res.status(502).json({ error: 'Falla una dependencia externa clave' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
