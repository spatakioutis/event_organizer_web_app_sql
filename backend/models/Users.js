import pool from '../db.js'

const addUser = async ({ username, firstName, lastName, email, password, profilePic, phone }) => {
    try {
        const res = await pool.query(
            `INSERT INTO Users (username, firstName, lastName, email, user_password, profilePic, phone) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [username, firstName, lastName, email, password, profilePic, phone]
        )
        console.log(res.rows)
        return res.rows[0]
    }
    catch (error) {
        throw error
    }
}

const findUserByID = async (id) => {
    try {
        const res = await pool.query(
            `SELECT * 
             FROM Users 
             WHERE user_id = $1`,
            [id]
        )
        return res.rows[0]
    }
    catch (error) {
        throw error
    }
}

const findUserByUsername = async (username) => {
    try {
        const res = await pool.query(
            `SELECT * 
             FROM Users 
             WHERE username = $1`,
            [username]
        )
        return res.rows[0]
    }
    catch (error) {
        throw error
    }
}

const updateUser = async ({id, updates}) => {

    // const updatesObj = JSON.parse(updates)
    const fields = Object.keys(updates)
    const values = Object.values(updates)

    //i dont know wchich fields are being updated beforehand so here i build the query dynamically
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')

    const query = `UPDATE Users SET ${setClause} WHERE user_id = $${fields.length + 1} RETURNING *`

    values.push(id)

    try {
        const res= await pool.query(
            query,
            values
        )
        return res.rows[0]

    } catch (error) {
        throw error
    }
}

const updatePassword = async ({id, password}) => {

    try {
        const res = await pool.query(
            `UPDATE Users
             SET user_password = $1
             WHERE user_id = $2 RETURNING *`,
            [password, id]
        )
        return res.rows[0]
    } catch (error) {
        throw error
    }
}

const deleteUser = async (id) => {
    try {
        await pool.query(
            `DELETE 
             FROM Users 
             WHERE user_id = $1`,
            [id]
        )
    } catch (error) {
        throw error
    }
}

export default {
    add:            addUser,
    findByID:       findUserByID,
    findByUsername: findUserByUsername,
    update:         updateUser,
    updatePassword,
    delete:         deleteUser
}