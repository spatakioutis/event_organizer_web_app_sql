import { 
    Box, 
    Typography,
    Button,
    Grid
} from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import axios from 'axios'
import Navbar from '../navbar'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import FlexBetween from '../../components/FlexBetween'
import TicketCard from '../../components/ticketCard'

const EventPage = () => {
    const navigate = useNavigate()
    const user = useSelector((state)=> state.user)
    const token = useSelector((state)=> state.token)
    const [event, setEvent] = useState(null)
    const { eventId } = useParams()

    const deleteEvent = async () => {
        try {
            await axios.delete(
                `http://localhost:3001/events/${eventId}`,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            navigate(`/profile/${user._id}`)
        }
        catch (error) {
            console.error("Error while trying to delete event: ", error)
        }
    }

    const takeFormmatedDate = (dateString) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') 
        const day = String(date.getDate()).padStart(2, '0')
        return `${day}/${month}/${year}`
    }

    useEffect(() => {
        const fetchEvent = async () => {

            try {
                const { data: response} = await axios.get(
                    `http://localhost:3001/events/${eventId}`,
                    {
                        headers: { "Authorization": `Bearer ${token}`}
                    }
                )
                response.event.host = response.user
                response.event.specificDateInfo.sort(((a, b) => new Date(a.date) - new Date(b.date)))
                setEvent(response.event)
            }
            catch (error) {
                console.error("Error fetching single event: ", error)
            }
        }
        fetchEvent()
    }, [eventId])

    if (!event) {
        return <div>Loading...</div>; 
    }

    const bookingElements = event.specificDateInfo.map((info) => {
        return (
            <TicketCard
                eventID={eventId}
                key={info.date}
                date={info.date}
                location={info.location}
                seatsAvailable={info.seatsAvailable}
                price={event.ticketPrice}
            />
        )
    })

    return (<>
        <Navbar />
        <Box 
            margin="130px 100px 50px 100px"
            boxShadow="3px 3px 4px 1px rgba(0,0,0,0.3)"
            borderRadius="15px"
            display="grid"
            gridTemplateRows="1fr auto"
            sx={{minWidth: "60vw"}}
        >
            <Box 
                sx={{
                    gridRow: "1 / 2",
                    maxHeight: "500px"
                }}
                
            >
                <img
                    style={{objectFit: "cover", borderRadius:"15px 15px 0 0"}}
                    width="100%" 
                    height="100%"
                    alt="event image"
                    src={`http://localhost:3001/${event.image.replace('public\\', '')}`}
                />
            </Box>
            <Box
                sx={{
                    gridRow: "span 1"
                }}
                padding="10px 20px 0 20px"
            >   
                <FlexBetween>
                    <Typography
                        color="black"
                        fontWeight="bold"
                        fontSize="22pt"
                        sx={{textIndent: "5px"}}
                    >
                        {event.title}
                    </Typography>
                    {event.host._id === user._id && (
                        <Box
                            display="flex"
                            gap="15px"
                        >    
                            <Button
                                sx={{
                                    backgroundColor: "rgb(90,90,255)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgb(120,120,255)"
                                    }
                                }}
                                onClick={() => navigate(`/events/update/${eventId}`)}
                            >
                                Update Event
                            </Button>    
                            <Button
                                sx={{
                                    backgroundColor: "rgb(255,0,0)",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "rgb(255,80,80)"
                                    }
                                }}
                                onClick={deleteEvent}
                            >
                                Delete Event
                            </Button>
                        </Box>  
                    )}
                </FlexBetween>

                <Box 
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    gap="8px"
                >   
                    <LocationOnIcon sx={{color: "black"}}/>
                    <Typography
                        color="black"
                        fontSize="14pt"
                    >
                        {(event.specificDateInfo.length > 1) ? 'Multiple locations' : `${event.specificDateInfo[0].location}`}
                    </Typography>
                </Box>
                <Box 
                    display="flex"
                    justifyContent="flex-start"
                    alignItems="center"
                    gap="8px"
                >   
                    <CalendarMonthIcon sx={{color: "black"}}/>
                    <Typography
                        color="black"
                        fontSize="12pt"
                    >
                        {( event.specificDateInfo.length > 1 ) ? `${takeFormmatedDate(event.specificDateInfo[0].date)} - ${takeFormmatedDate(event.specificDateInfo[event.specificDateInfo.length - 1].date)}` : `${takeFormmatedDate(event.specificDateInfo[0].date)}`}
                    </Typography>
                </Box>
            </Box>
            <Box
                padding="0 20px"
                marginTop="30px"
            >
                <Typography
                    color="black"
                    fontSize="14pt"
                    fontWeight="bold"
                >
                    Description
                </Typography>
                <Typography 
                    color="black"
                >
                    {event.description}
                </Typography>
                
            </Box>
            <Box
                padding="0 20px"
                marginTop="30px"
            >
                <Typography
                    color="black"
                    fontSize="14pt"
                    fontWeight="bold"
                >
                    Host information
                </Typography>
                <Typography 
                    color="black"
                    fontSize="14pt"
                    marginTop="10px"
                >
                    { `${event.host.firstName} ${event.host.lastName}`}
                </Typography>
                <Box 
                    display="flex"
                    gap="10px"
                >
                    <Typography
                        color="black"
                        fontSize="12pt"
                        fontWeight="bold"
                    >
                        Email: 
                    </Typography>
                    <Typography
                        color="black"
                        fontSize="12pt"
                    >
                        {event.host.email}
                    </Typography> 

                    <Typography
                        color="black"
                        fontSize="12pt"
                        fontWeight="bold"
                        marginLeft="30px"
                    >
                        Phone: 
                    </Typography>
                    <Typography
                        color="black"
                        fontSize="12pt"
                    >
                        {event.host.phone}
                    </Typography>                        
                </Box>
            </Box>
            <Box 
                padding="0 20px"
            >
                <Typography
                    color="black"
                    fontSize="14pt"
                    fontWeight="bold"
                    marginTop="30px"
                >
                    Buy tickets
                </Typography>
                <Box>
                    {bookingElements}
                </Box>
            </Box>
        </Box>
    </>)
}

export default EventPage 