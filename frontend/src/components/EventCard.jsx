import { 
    Box, 
    Typography 
} from "@mui/material"
import { useNavigate } from "react-router-dom"

const EventCard = ({event}) => {
    const navigate = useNavigate()
    const imagePath = event.image.replace('public\\', '')
    
    const takeFormmatedDate = (dateString) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') 
        const day = String(date.getDate()).padStart(2, '0')
        return `${day}/${month}/${year}`
    }

    event.dates.sort(((a, b) => new Date(a) - new Date(b)))
    const dates = ( event.dates.length > 1 ) ? `${takeFormmatedDate(event.dates[0])} - ${takeFormmatedDate(event.dates[event.dates.length - 1])}` : `${takeFormmatedDate(event.dates[0])}`
    
    const locations = ( event.locations.length > 1) ? 'MULTIPLE LOCATIONS' : `${event.locations[0]}`

    return (
        <Box 
            onClick={() => navigate(`/events/${event._id}`)}
            width="280px" 
            height="300px"
            display="grid"
            gridTemplateRows="6fr"
            sx={{
                gridColumn: "span 1",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "15px",
                "&:hover": {
                    cursor: "pointer",
                    boxShadow: "3px 3px 6px 1px rgba(0, 0, 255, 0.15)"
                }
            }}
        >
            <Box 
                sx={{
                    height: "160px"
                }}
            >
                <img
                    style={{objectFit: "cover", borderRadius:"15px 15px 0 0"}}
                    width="100%" 
                    height="100%"
                    alt="event image"
                    src={`http://localhost:3001/${imagePath}`}
                />
            </Box>
            <Typography
                padding="1rem 1rem 0 1rem"
                color="blue"
            >
                {dates}
            </Typography>
            <Typography
                padding="0 1rem"
                color="black"
                fontWeight="bold"
                textAlign="left"
                sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical"
                }}
            >
                {event.title}
            </Typography>
            <Typography
                padding="1rem"
                color="black"
                textAlign="left"
                fontWeight="100"
            >
                {locations}
            </Typography>
        </Box>
    )
}

export default EventCard