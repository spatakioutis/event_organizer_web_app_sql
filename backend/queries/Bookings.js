import pool from "../db.js"

const addBooking = async (bookingData) => {

    const {user, eventDateID, numOfTickets} = bookingData

    try {
        const result = await pool.query(
            `INSERT INTO Bookings (user_id, event_date_id, numoftickets)
            VALUES ($1, $2, $3) RETURNING *`,
            [user, eventDateID, numOfTickets]
        )

        return result.rows[0]
    }   
    catch (error) {
        throw error
    }
}

const findBookingByID = async (id) => {
    try {
        const result = await pool.query(
            `SELECT *
            FROM Bookings 
            WHERE booking_id = $1`,
            [id]
        )

        return result.rows[0]
    }
    catch (error) {
        throw error 
    }
}

const findBookingsByHost = async (hostID) => {

    try {
        const result = await pool.query(
            `SELECT *
             FROM Bookings b
             INNER JOIN EventDates ed ON b.event_date_id = ed.event_dates_id
             INNER JOIN Events e ON ed.event_id = e.event_id
             WHERE b.user_id = $1
             ORDER BY ed.date DESC`,
            [hostID]
        )
        
        return result.rows
    }
    catch (error) {
        throw error 
    }    
}

const deleteBooking = async (id) => {
    try {
        const result = await pool.query(
            `DELETE 
            FROM Bookings 
            WHERE booking_id = $1`,
            [id]
        )

        return result.rows[0]
    }
    catch (error) {
        throw error 
    }
}

export default {
    add:        addBooking,
    findByID:   findBookingByID,
    findByHost: findBookingsByHost,
    delete:     deleteBooking
}