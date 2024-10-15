import { 
    Box,
    Typography 
} from "@mui/material"
import FlexBetween from "./FlexBetween"
import EventCard from "./EventCard"
import axios from "axios"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

const EventRow = (props) => {

    const token = useSelector((state) => state.token)
    const navigate = useNavigate()
    const [events, setEvents] = useState([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                if (props.category === "Newest") {
                    const {data: response} = await axios.get(
                        `http://localhost:3001/events/newest?fetchAll=false`,
                        {
                            headers: { "Authorization": `Bearer ${token}`}
                        }
                    )
                    setEvents(response.events)
                }
                else {
                    const {data: response} = await axios.get(
                        `http://localhost:3001/events/type?type=${props.category}&fetchAll=false`,
                        {
                            headers: { "Authorization": `Bearer ${token}`}
                        }
                    )
                    setEvents(response.events)
                } 
            }
            catch (error) {
                console.error("Erro fetching events of type: " + type , error)
            }
        }
        fetchEvents()
    }, [props.category])

    const eventCards = events.map(event => <EventCard key={event._id} event={event} />)

    return (
        <Box
            minWidth="1150px"
            width="76vw"
            padding="5px"
        >
            <FlexBetween>
                <Typography
                    color="black"
                    fontWeight="bold"
                    fontSize="1.3rem"
                >
                    {props.category}
                </Typography>
                <Typography
                    onClick={() => navigate(`/events/category/${props.category}`)}
                    color="rgb(128,0,128)"
                    fontSize="1rem"
                    sx={{
                        "&:hover": {
                            color: "rgb(200,0,200)",
                            cursor: "pointer"
                        }
                    }}
                >
                    See more...
                </Typography>
            </FlexBetween>
            {eventCards.length > 0 ? (
                <Box
                    padding="10px 0"
                    display="grid"
                    gap="15px"
                    gridTemplateColumns="repeat(4, 1fr)"
                >
                    {eventCards}
                </Box>
            ) : (
                <Typography 
                    color="black"
                    fontSize="1.3rem"
                >
                    {`No ${props.category} events exist at the moment!`}
                </Typography>                
            )
            }
        </Box>
    )
}

export default EventRow