const pool = require('./src/db/connection') // Ajusta si usas otro nombre
require('dotenv').config()

async function verChats() {
    const [rows] = await pool.query(`
        SELECT 
            c.nombre AS Nombre,
            c.numero AS Numero,
            c.ubicacion AS Ubicacion,
            m.mensaje AS Mensaje,
            m.respuesta AS Respuesta,
            m.fecha AS Fecha
        FROM 
            contactos c
        JOIN 
            mensajes m ON c.numero = m.numero
        ORDER BY 
            c.numero, m.fecha;
    `)

    let actual = null
    rows.forEach(row => {
        if (row.Numero !== actual) {
            console.log('\n===============================')
            console.log(`👤 Nombre: ${row.Nombre || 'No registrado'}`)
            console.log(`📱 Número: ${row.Numero}`)
            console.log(`📍 Ubicación: ${row.Ubicacion || 'No disponible'}`)
            console.log('===============================\n')
            actual = row.Numero
        }

        console.log(`🗨️ Cliente: ${row.Mensaje}`)
        console.log(`🤖 Bot: ${row.Respuesta}`)
        console.log(`🕒 Fecha: ${row.Fecha}\n`)
    })
}

verChats().then(() => process.exit()).catch(console.error)