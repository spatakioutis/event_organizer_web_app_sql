import { 
    Box, 
    Typography
} from "@mui/material"
import Navbar from "../navbar"
import EventCard from "../../components/EventCard"
import { useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import axios from "axios"

const EventTypePage = () => {

    const token = useSelector((state) => state.token)
    const navigate = useNavigate()
    const {type} = useParams()
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                if (type === "Newest") {
                    const {data: response} = await axios.get(
                        `http://localhost:3001/events/newest?fetchAll=true`,
                        {
                            headers: { "Authorization": `Bearer ${token}`}
                        }
                    )
                    setEvents(response.events)
                }
                else {
                    const {data: response} = await axios.get(
                        `http://localhost:3001/events/type?type=${type}&fetchAll=${true}`,
                        {
                            headers: { "Authorization": `Bearer ${token}`}
                        }
                    )
                    setEvents(response.events)
                } 
            }
            catch (error) {
                console.error("Error fetching events of type: " + type , error)
            }
        }
        fetchEvents()
    }, [type])

    const eventCards = events.map(event => <EventCard key={event._id} event={event} />)

    return (<>
        <Navbar />
        <Box
            marginTop="82px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
                padding="10px 0"
                borderBottom="2px solid black"
                borderLeft="2px solid black"
                borderRight="2px solid black"
                borderRadius="0 0 30px 30px"
                marginBottom="20px"
                sx={{
                    backgroundColor: "rgb(100, 20, 100)"
                }}
            >
                <Typography 
                    color="white"
                    fontWeight="bold"
                    fontSize="2.5rem"
                    letterSpacing="2px"
                    fontFamily="'Raleway', sans-serif"
                >
                    {type}
                </Typography>
            </Box>

            {eventCards.length > 0 ? (
                <Box
                    padding="0 20px"
                    display="grid"
                    gap="15px"
                    gridTemplateColumns="repeat(5, 1fr)" 
                >
                    {eventCards}
                </Box>
            ) : (
                <Typography 
                    color="black"
                    fontSize="1.3rem"
                >
                    {`No ${type} events exist at the moment!`}
                </Typography>                
            )
            }
        </Box>
    </>)
}

export default EventTypePage