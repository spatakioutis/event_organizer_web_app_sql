import { 
    Box,
    Typography,
    Tabs, 
    Tab
} from "@mui/material"
import axios from 'axios'
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import NewEventForm from "./NewEventForm"
import BookingCard from "../../components/BookingCard"

const MyBookings = () => {

    const token = useSelector((state) => state.token)
    const [selectedTab, setSelectedTab] = useState(0)
    const [upcomingBookings, setUpcomingBookings] = useState([])
    const [pastBookings, setPastBookings] = useState([])

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)
    }

    useEffect(() => {
        const fetchMyBookings = async (bookingStatus) => {

            try {
                const {data: response} = await axios.get(
                    `http://localhost:3001/bookings/${bookingStatus}`,
                    {
                        headers: { "Authorization": `Bearer ${token}`}
                    }
                )

                if (bookingStatus === "past") {
                    setPastBookings(response.bookings)
                }
                else {
                    setUpcomingBookings(response.bookings)
                }
            }
            catch (error) {
                console.error("Error fetching user bookings: ", error)
            }
        }
        fetchMyBookings("upcoming")
        fetchMyBookings("past")
    
    }, [])

    const pastBookingCards = pastBookings.map((booking) => {
        return (
            <BookingCard 
                key={booking.bookingDetails._id} 
                title={booking.title}
                image={booking.image}
                eventID={booking.bookingDetails.event}
                date={booking.bookingDetails.date}
                numOfTickets={booking.bookingDetails.numOfTickets}
                bookingID={booking.bookingDetails._id}
            />
        )
    })

    const upcomingBookingCards = upcomingBookings.map((booking) => {
        return (
            <BookingCard 
                key={booking.bookingDetails._id} 
                title={booking.title}
                image={booking.image}
                eventID={booking.bookingDetails.event}
                date={booking.bookingDetails.date}
                numOfTickets={booking.bookingDetails.numOfTickets}
                bookingID={booking.bookingDetails._id}
            />
        )
    })
    
    return (
        <Box width="100%">
            <Typography
                color="black"
                fontWeight="bold"
                fontSize="1.3rem"
                marginBottom="20px"
            >
                My Bookings
            </Typography>
            <Box>
                <Tabs 
                    value={selectedTab} 
                    onChange={handleTabChange} 
                    aria-label="Booking Tabs"
                    sx={{ marginBottom: "2rem"}}
                    TabIndicatorProps={{
                        style: {
                            backgroundColor: "black"
                        }
                    }}
                >
                    <Tab
                        label="Upcoming"
                        sx={{
                            color: "black",
                            '&:focus': {
                                color: "black"
                            }
                        }}
                    />
                    <Tab
                        label="Past"
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
                    {upcomingBookingCards.length > 0 ? upcomingBookingCards : (
                        <Typography
                            color="black"
                            sx={{gridColumn: "span 2"}}
                        >
                            You haven't booked any tickets yet!
                        </Typography>
                    )}
                </Box>
            )}
            { selectedTab === 1 && (
                <Box
                    display="grid"
                    gap="20px"
                    gridTemplateColumns="repeat(3, 1fr)"
                    maxWidth="900px" 
                >
                    {pastBookingCards.length > 0 ? pastBookingCards : (
                        <Typography
                            color="black"
                            sx={{gridColumn: "span 2"}}
                        >
                            You don't have any past ticket bookings!
                        </Typography>
                    )}
                </Box>
            )}            
        </Box>
    )
}

export default MyBookings

                                        