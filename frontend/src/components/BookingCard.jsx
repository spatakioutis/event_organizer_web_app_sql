import { 
    Box, 
    Typography
} from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import FlexBetween from "./FlexBetween"
import axios from "axios"

const BookingCard = (props) => {
    const user = useSelector((state) => state.user)
    const token = useSelector((state) => state.token)
    const navigate = useNavigate()
    const imagePath = props.image.replace('public\\', '')

    const deleteBooking = async () => {
        try {
            await axios.delete(
                `http://localhost:3001/bookings/${props.bookingID}`,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            navigate(0)
        }
        catch (error) {
            console.error("Error while trying to delete booking: ", error)
        }
    }
    
    const takeFormmatedDate = (dateString) => {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0') 
        const day = String(date.getDate()).padStart(2, '0')
        return `${day}/${month}/${year}`
    }

    return (
        <Box 
            onClick={() => navigate(`/events/${props.eventID}`)}
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
                    alt="props image"
                    src={`http://localhost:3001/${imagePath}`}
                />
            </Box>
            <Typography
                padding="1rem 1rem 0 1rem"
                color="blue"
            >
                {takeFormmatedDate(props.date)}
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
                {props.title}
            </Typography>
            <FlexBetween>
                <Typography
                    padding="1rem"
                    color="black"
                    textAlign="left"
                    fontWeight="100"
                >
                    {`Number of tickets: ${props.numOfTickets}`}
                </Typography>
                <DeleteIcon
                     onClick={(e) => {
                        e.stopPropagation()
                        deleteBooking()
                    }}
                    sx={{
                        color: "white",
                        backgroundColor: "red",
                        borderRadius: "50%",
                        padding: "3px",
                        marginRight: "8px",
                        "&:hover": {
                            backgroundColor: "rgb(255,70,70)"
                        }
                    }} 
                />
            </FlexBetween>
        </Box>
    )
}

export default BookingCard