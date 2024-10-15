import { 
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useMediaQuery,
    Tabs, 
    Tab,
    styled
 } from "@mui/material"
import { Search } from "@mui/icons-material"
import axios from "axios"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setLogout } from "../../state"
import { useNavigate, Link } from "react-router-dom"
import FlexBetween from "../../components/FlexBetween"
import UserImage from "../../components/UserImage"
import DropdownSearch from "../../components/DropdownSearch"

const Navbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const token = useSelector((state) => state.token)
    const user = useSelector((state) => state.user)
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")
    const [dropdownActive, setDropdownActive] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [eventsFound, setEventsFound] = useState([])
    
    const handleChange = (e) => {
        setSearchQuery(e.target.value)
    } 

    const fetchEvents = async (query) => {
        if (!query) {
            setDropdownActive(false)
            return
        }
        try {
            const {data: result} = await axios.get(
                `http://localhost:3001/events/search?searchQuery=${query}`,
                {
                    headers: { "Authorization": `Bearer ${token}`}
                }
            )
            setEventsFound(result.events)
            setDropdownActive(true)
        } catch (error) {
            console.error("Error fetching search results: ", error)
            setEventsFound([])
            setDropdownActive(false)
        }
    }

    useEffect(() => {
        if (searchQuery.trim()) {
            const timer = setTimeout(() => {
                fetchEvents(searchQuery)
            }, 1000)

            return () => clearTimeout(timer)
        }
        else {
            setEventsFound([])
            setDropdownActive(false)
        }
    }, [searchQuery])

    const fullName = `${user.firstName} ${user.lastName}`

    const StyledTab = styled(Tab)(({ theme }) => ({
        '&:hover': {
            backgroundColor: "#f0f0f0",
        },
    }))

    return (<>
        <Box 
            display="flex"
            justifyContent="space-evenly"
            alignItems="center"
            padding="1rem" 
            backgroundColor="white"
            gap="100px"
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "50px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: 10
            }}
        >
            <Box 
                gap="1.75rem" 
                display="flex"
            >
                <Box
                    height="50px"
                    width="100px"
                    onClick={() => navigate("/home")}
                    sx={{
                        ":hover": {
                            cursor: "pointer",
                            filter: "brightness(0.95)"
                        }
                    }}
                    marginLeft="-20px"
                >
                    <img 
                        src="http://localhost:3001/assets/logo transaparent.png" 
                        alt="logo" 
                        width="100%"
                        height="100%"
                    />
                </Box>
                {isNonMobileScreens && (
                    <FlexBetween 
                        backgroundColor="white"
                        border="1px solid #ccc" 
                        gap="3rem"
                        padding="0.1rem 1.5rem"
                    >
                        <InputBase 
                            placeholder="Search..."
                            onFocus={() => setDropdownActive(true)}
                            onChange={handleChange}
                            value={searchQuery}
                            autoComplete="off"
                        />
                        <IconButton>
                            <Search />
                        </IconButton>
                    </FlexBetween>
                )}
            </Box>

            {/* Desktop nav */}
            {isNonMobileScreens && (
                <FlexBetween gap="2rem">
                    <Tabs value={false} aria-label="Navigation Tabs">
                        <StyledTab
                            label="Newest"
                            component={Link}
                            to="/events/category/Newest"
                        />
                        <StyledTab
                            label="Movies"
                            component={Link}
                            to="/events/category/Movies"
                        />
                        <StyledTab
                            label="Theater"
                            component={Link}
                            to="/events/category/Theater"
                        />
                        <StyledTab
                            label="Music"
                            component={Link}
                            to="/events/category/Music"
                        />
                        <StyledTab
                            label="Sports"
                            component={Link}
                            to="/events/category/Sports"
                        />
                    </Tabs>

                    <FormControl 
                        variant="standard" 
                        value={fullName}
                    >
                        <Select
                            value={fullName}
                            style={{
                                minWidth: '150px',
                                width: 'auto'
                            }}
                            sx={{
                                border: "1px solid #ccc",
                                backgroundColor: "#f0f0f0",
                                width: "150px",
                                borderRadius: "0.25rem",
                                p: "0.25rem 1rem",
                                "& .MuiSvgIcon-root": {
                                    pr: "0.25rem",
                                    width: "3rem"
                                },
                                "& .MuiSelect-select:focus": {
                                    backgroundColor: "#f0f0f0"
                                }
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem
                                onClick={() => navigate(`/profile/${user._id}`)}
                                value={fullName}
                                style={{
                                    minWidth: '150px',
                                    width: 'auto'
                                }}
                            >
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => {
                                dispatch(setLogout())
                                navigate('/login')
                            }}>
                                Log Out
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <UserImage 
                        image={user.profilePic} 
                    />
                </FlexBetween>
            )}
        </Box>
        { dropdownActive && 
            <DropdownSearch setDropdownActive={setDropdownActive} events={eventsFound}/>
        }
    </>)
}

export default Navbar
