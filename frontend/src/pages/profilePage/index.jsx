import FlexBetween from "../../components/FlexBetween"
import { 
    Box,
    Tabs, 
    Tab,
    styled
 } from "@mui/material"
import { useState } from "react"
import Navbar from "../navbar"
import MyAccount from "./MyAccount"
import MyEvents from "./MyEvents"
import AccountSettings from "./AccountSettings"
import MyBookings from "./MyBookings"

const ProfilePage = () => {
    
    const StyledTab = styled(Tab)(({ theme }) => ({
        '&:hover': {
            backgroundColor: "#f0f0f0",
        },
        textAlign: "left",
        alignItems: "flex-start"
    }))

    const [selectedTab, setSelectedTab] = useState(0)

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue)
    }
    
    return (
    <>
        <Navbar />
        <Box 
            //backgroundColor="red"
            marginTop="80px"
            display="flex"
            justifyContent="center"
            alignItems="center"
        >
            <Box 
                padding="2rem"
                width="75%"
                display="grid"
                gridTemplateColumns="1fr 4fr"
                gap="50px" 
            >
                <Box>
                    <Tabs 
                        value={selectedTab} 
                        orientation="vertical"
                        onChange={handleTabChange} 
                        aria-label="Account Tabs"
                        sx={{ marginBottom: "2rem"}}
                    >
                        <StyledTab
                            label="Account Details"
                        />
                        <StyledTab
                            label="My bookings"
                        />
                        <StyledTab
                            label="My events"
                        />
                        <StyledTab
                            label="Account Settings"
                        />
                    </Tabs>
                </Box>
                <Box>
                    {selectedTab === 0 && <MyAccount />}
                    {selectedTab === 1 && <MyBookings />}
                    {selectedTab === 2 && <MyEvents />}
                    {selectedTab === 3 && <AccountSettings />}
                </Box>
            </Box>
        </Box>
    </>
    )
}

export default ProfilePage