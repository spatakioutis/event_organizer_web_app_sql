import pool from "./db.js"

const structureFullEventsInfo = (data) => {

    if (data.rowCount === 0) return []

    return data.rows.reduce((acc, row) => {
           
        const existingEvent = acc.find(event => event.id === row.event_id)

        const dateInfo = {
            id: row.event_dates_id,
            date: row.date
        }

        if (existingEvent) {
            existingEvent.specificDateInfo.push(dateInfo)
        } else {
            acc.push({
                id: row.event_id,
                status: row.status,
                specificDateInfo: [dateInfo]
            })
        }

        return acc
    }, [])
}

const updateEventStatus = async () => {
    const now = new Date()

    try {
        // Fetch events
        const result = await pool.query(
            `SELECT *
             FROM Events e
             INNER JOIN EventDates ed ON e.event_id = ed.event_id`
        )

        const events = structureFullEventsInfo(result)

        // Iterate over each event and update status if necessary
        for (let event of events) {

            const oldStatus = event.status
            let newStatus

            const allDatesPast = event.specificDateInfo.every(specificDateInfo => specificDateInfo.date < now)
            const noDatesPast = event.specificDateInfo.every(specificDateInfo => specificDateInfo.date > now)

            if (allDatesPast) {
                newStatus = 'past'
            }
            else if (noDatesPast) {
                newStatus = 'upcoming'
            }
            else {
                newStatus = 'ongoing'
            }

            if (oldStatus !== newStatus) {
                await pool.query(
                    `UPDATE Events
                    SET status = $1
                    WHERE event_id = $2`,
                    [newStatus, event.id]
                )
            }
        }

        console.log('[Scheduled Task Manager] Events\' status updated successfully')
    } catch (error) {
        console.error('[Scheduled Task Manager] Error updating Events\' status: ', error)
    }
}

export { updateEventStatus }