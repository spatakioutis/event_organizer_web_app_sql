import { 
    Box,
    Typography 
 } from "@mui/material"
import Navbar from '../../pages/navbar'
import EventRow from "../../components/EventRow"
import "../../styles/waveAnimation.css"

const HomePage = () => {
    return (<>
        <Navbar />
        <Box
            marginTop="80px"
            padding="100px 150px"
            sx={{
                zIndex: 1,
                backgroundColor: 'rgb(100, 20, 100)',
                borderRadius: "50% 0 50% 0",
                boxShadow: "10px 6px 3px 3px rgba(0, 0, 0, 0.3)",
                animation: 'waveAnimation 3s linear'
            }}
        >
            <Typography color="white" variant="h4" fontWeight="bold" gutterBottom>
                Welcome to Eventory, the best place to <br /> manage and book events!
            </Typography>
            <Typography color="white" variant="body1" paragraph>
                Book your next tickets and enjoy your favorite events in just a few steps! 
            </Typography>
            <Typography color="white" variant="body1" paragraph>
                Want to create your own event? No problem! We got you covered!
            </Typography>
        </Box>
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            gap="100px"
            marginTop="90px"
        >
            <EventRow 
                category="Newest"
            />
            <EventRow 
                category="Music"
            />
            <EventRow 
                category="Theater"
            />
            <EventRow 
                category="Movies"
            />
            <EventRow 
                category="Sports"
            />
        </Box>
    </>)
}

export default HomePage