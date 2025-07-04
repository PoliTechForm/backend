//! Servirá para ver el uso del sistema que tiene el usuario

export const getMetrics = async (_req, res) => {
    try {
        const response = await fetch("http://localhost:8000/stats",{
            method: "GET"
        })
        if(response.ok){
            const data = await response.json()
            return res.status(201).json(data)
        } else {
            return res.status(400).json({msg: "Error al obtener la información"})
        }
    } catch (error) {
        console.error("Error en getMetrics:", error);
        return res.status(500).json({ msg: "Error del servidor" });
    }

}