import Event from './models/Events.js'

const updateEventStatus = async () => {
    const now = new Date()

    try {
        // Fetch events
        const events = await Event.find({})

        // Iterate over each event and update status if necessary
        for (let event of events) {
            const oldStatus = event.status

            const allDatesPast = event.specificDateInfo.every(specificDateInfo => specificDateInfo.date < now)
            const noDatesPast = event.specificDateInfo.every(specificDateInfo => specificDateInfo.date > now)

            if (allDatesPast) {
                event.status = 'past'
            }
            else if (noDatesPast) {
                event.status = 'upcoming'
            }
            else {
                event.status = 'ongoing'
            }

            if (oldStatus !== event.status) {
                await event.save()
            }
        }

        console.log('[Scheduled Task Manager] Events\' status updated successfully')
    } catch (error) {
        console.error('[Scheduled Task Manager] Error updating Events\' status: ', error)
    }
}

export { updateEventStatus }