import pool from '../db.js'

const addEvent = async (eventData) => {
    const { title, type, host, duration, image, description, ticketPrice, specificDateInfo } = eventData

    try {
        const resEvent = await pool.query(
            `INSERT INTO Events (title, status, type, host, duration, image, description, ticketPrice) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [title, 'upcoming', type, host, duration, image, description, ticketPrice]
        )

        const eventID = resEvent.rows[0].id

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
            return {}
        } 

        const eventsFullInfo = result.rows.reduce((acc, row) => {
           
            const existingEvent = acc.find(event => event.id === row.event_id)

            const dateInfo = {
                id: row.event_date_id,
                date: row.date,
                location: row.location,
                totalSeats: row.totalSeats,
                seatsAvailable: row.seatsAvailable
            }

            if (existingEvent) {
                existingEvent.specificDateInfo.push(dateInfo)
            } else {
                acc.push({
                    id: row.id,
                    title: row.title,
                    description: row.description,
                    specificDateInfo: [dateInfo]
                })
            }

            return acc
        }, [])

        return eventsFullInfo[0]
        
    } catch (error) {
        throw error
    }
}

const findEventsByTitle = async (title) => {

    //here we also search for partial matches because this query will be used for search
    try {
        const events = await pool.query(
            " SELECT * FROM EVENTS WHERE title LIKE $1 ",
            ['%' + title + '%']
        )

        let eventsInfo = []

        if ( events.rowCount > 0 ) {
            eventsInfo = await Promise.all(events.rows.map(async (event) => {
                const eventDates = await pool.query(
                    " SELECT * FROM EventDates WHERE event_id = $1",
                    [event.id]
                )
                return {
                    ...event,
                    specificDateInfo: eventDates.rows
                }
            }))
        }

        return eventsInfo

    } catch (error) {
        throw error
    }
}

const updateEvent = async ({ id, updates }) => {
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    if (fields.length === 0) {
        throw new Error('No fields to update.')
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')

    const query = `UPDATE Events SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`
    values.push(id) // Add the id to the end of the values array

    try {
        const res = await pool.query(query, values)
        return res.rows[0] // Return the updated event
    } catch (error) {
        throw error // Handle error appropriately
    }
}

const deleteEvent = async (id) => {
    try {
        const res = await pool.query(
            `DELETE FROM Events WHERE id = $1 RETURNING *`,
            [id]
        )
        return res.rows[0]
    } catch (error) {
        throw error
    }
}

export default {
    add: addEvent,
    findByID: findEventByID,
    updateEvent,
    delete: deleteEvent,
}
