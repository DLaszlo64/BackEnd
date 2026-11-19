import { useState, useEffect } from "react";

function name() {
    const [sad, setasd] = useState([]);
    const [toltes, setToltes] = useState(true);
    const [hiba, setHiba] = useState(null);


    useEffect(() =>{
        const adatokLekerese = async () =>{
            try{
                const valasz = await fetch("...")

                if (!valasz.ok) {
                    throw new Error("Hiba történt az adatok lekérésekor!");
                    
                }

                const adatok = await valasz.json();
                setasd(adatok);
            }
            catch(err){
                setHiba(err.message);
            }finally{
                setToltes(false)
            }
        };
        adatokLekerese();
    }, []);
    if (toltes) {
        return <p>Adatok betöltése folyamatba...</p>
    }
    if (hiba) {
        return <p style={{ color: 'red'}}>Hiba: {hiba}</p>;
    }

    return(
        <div>
            <h2>Felhasználok listája</h2>
            <ul>
                {felhasznalok.map((user) => (
                    <li key={user.id}>
                    <strong>{user.name}</strong> – {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default name;