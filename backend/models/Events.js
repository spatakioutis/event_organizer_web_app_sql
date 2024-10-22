import pool from '../db.js'

const structureFullEventsInfo = (data) => {

    if (data.rowCount === 0) return []

    return data.rows.reduce((acc, row) => {
           
        const existingEvent = acc.find(event => event.id === row.event_id)

        const dateInfo = {
            id: row.event_dates_id,
            date: row.date,
            location: row.location,
            totalSeats: row.totalSeats,
            seatsAvailable: row.seatsAvailable
        }

        if (existingEvent) {
            existingEvent.specificDateInfo.push(dateInfo)
        } else {
            acc.push({
                id: row.event_id,
                title: row.title,
                status: row.status,
                type: row.type,
                host: row.host,
                duration: row.duration, 
                image: row.image,
                ticketPrice: row.ticketprice,
                description: row.description,
                specificDateInfo: [dateInfo]
            })
        }

        return acc
    }, [])
}

const addEvent = async (eventData) => {
    const { title, type, host, duration, image, description, ticketPrice, specificDateInfo } = eventData

    try {
        const resEvent = await pool.query(
            `INSERT INTO Events (title, status, type, host, duration, image, description, ticketPrice) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, 'upcoming', type, host, duration, image, description, ticketPrice]
        )

        const eventID = resEvent.rows[0].event_id

        await Promise.all(specificDateInfo.map(date => {
            return pool.query(
                `INSERT INTO EventDates (event_id, date, location, seatsAvailable, totalSeats) 
                    VALUES ($1, $2, $3, $4, $5)`,
                [eventID, date.date, date.location, date.seatsAvailable, date.totalSeats]
            )
        }))

        return {
            ...resEvent.rows[0],
            specificDateInfo
        }
    } catch (error) {
        await pool.query('ROLLBACK')
        throw error
    }
}

const findEventByID = async (id) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM Events e
             INNER JOIN EventDates ed
             ON e.event_id = ed.event_id
             WHERE e.event_id = $1`,
            [id]
        )

        if (result.rowCount === 0) {
            return null
        } 

        const eventsFullInfo = structureFullEventsInfo(result)

        return eventsFullInfo[0]
        
    } catch (error) {
        throw error
    }
}

const findEventsByType = async (type) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM Events e
             INNER JOIN EventDates ed
             ON e.event_id = ed.event_id
             WHERE e.type = $1 AND ed.date >= NOW()
             ORDER BY e.created_at DESC`,
            [type]
        )

        return structureFullEventsInfo(result)
        
    } catch (error) {
        throw error
    }
}

const findEventsByNewest = async () => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM Events e
             INNER JOIN EventDates ed
             ON e.event_id = ed.event_id
             WHERE ed.date >= NOW()
             ORDER BY e.created_at DESC`,
        )

        return structureFullEventsInfo(result)

    } catch (error) {
        throw error
    }
}

const findEventsByHost = async (hostID) => {
    try {
        const result = await pool.query(
            `SELECT *
             FROM Events e
             INNER JOIN EventDates ed
             ON e.event_id = ed.event_id
             WHERE e.host = $1 AND ed.date >= NOW()
             ORDER BY e.created_at DESC`,
             [hostID]
        )

        return structureFullEventsInfo(result)

    } catch (error) {
        throw error
    }
}

const findEventsByTitle = async (title) => {
    
    //here we also search for partial matches because this query will be used for search
    try {
        const result = await pool.query(
            `SELECT *
             FROM Events e
             INNER JOIN EventDates ed
             ON e.event_id = ed.event_id
             WHERE LOWER(e.title) LIKE LOWER($1) AND ed.date >= NOW()
             ORDER BY e.created_at DESC`,
            ['%' + title + '%']
        )

        return structureFullEventsInfo(result)
        
    } catch (error) {
        throw error
    }
}

const updateEvent = async ({ id, updates }) => {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')

    const query = `UPDATE Events SET ${setClause} WHERE event_id = $${fields.length + 1} RETURNING *`
    values.push(id)

    try {
        const result = await pool.query(query, values)
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

const updateSeatCount = async ({id, date, amount}) => {

    try {
        const result = await pool.query(
            `UPDATE EventDates
             SET seatsavailable = seatsavailable - $1
             WHERE event_id = $2 AND date = $3
             RETURNING *`,
             [amount, id, date]
        )

        return result.rows[0]
    }
    catch (error) {
        throw error
    }
}

const deleteEvent = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM Events WHERE event_id = $1 RETURNING *`,
            [id]
        )
        return result.rows[0]
    } catch (error) {
        throw error
    }
}

export default {
    add:          addEvent,
    findByID:     findEventByID,
    findByTitle:  findEventsByTitle,
    findByType:   findEventsByType,
    findByHost:   findEventsByHost,
    findByNewest: findEventsByNewest,
    update:       updateEvent,
    updateSeatCount,
    delete:       deleteEvent,
}
