import { 
    Box,
    Typography,
    Tabs, 
    Tab
} from "@mui/material"
import FlexBetween from "../../components/FlexBetween"
import axios from 'axios'
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import NewEventForm from "./NewEventForm"
import EventCard from "../../components/EventCard"

const MyEvents = () => {

    const token = useSelector((state) => state.token)
    const [selectedTab, setSelectedTab] = useState(0)
    const [events, setEvents] = useState([])

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)
    }

    useEffect(() => {
        const fetchMyEvents = async () => {

            try {
                const {data: response} = await axios.get(
                    'http://localhost:3001/events/host',
                    {
                        headers: { "Authorization": `Bearer ${token}`}
                    }
                )
                setEvents(response.events)
            }
            catch (error) {
                console.error("Error fetching user events: ", error)
            }
        }
        if ( selectedTab === 0 ) {
            fetchMyEvents()
        }
    }, [selectedTab])

    const eventCards = events.map((event) => {
        return <EventCard key={event._id} event={event}/>
    })
    
    return (
        <Box width="100%">
            <Typography
                color="black"
                fontWeight="bold"
                fontSize="1.3rem"
                marginBottom="20px"
            >
                My Events
            </Typography>
            <Box>
                <Tabs 
                    value={selectedTab} 
                    onChange={handleTabChange} 
                    aria-label="Event Tabs"
                    sx={{ marginBottom: "2rem"}}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: "black"
                        }
                    }}
                >
                    <Tab
                        label="My events"
                        sx={{
                            color: "black",
                            '&:focus': {
                                color: "black"
                            }
                        }}
                    />
                    <Tab
                        label="Create new"
                        sx={{
                            color: "black",
                            '&:focus': {
                                color: "black"
                            }
                        }}
                    />
                </Tabs>
            </Box>
            { selectedTab === 0 && (
                <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(3, 1fr)"
                    maxWidth="900px" 
                >
                    {eventCards.length > 0 ? eventCards : (
                        <Typography
                            color="black"
                        >
                            You haven't created any events yet!
                        </Typography>
                    )}
                </Box>
            )}
            { selectedTab === 1 && (
                <Box>
                    <NewEventForm />
                </Box>
            )}            
        </Box>
    )
}

export default MyEvents

                                        