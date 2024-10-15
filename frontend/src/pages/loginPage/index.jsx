import { 
    Box,
    Typography,
    useMediaQuery
} from "@mui/material"
import Form from "./Form"

const LoginPage = () => {
    
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)")

    return (
        <Box>

            {/* title box */}
            <Box 
                width="100%" 
                backgroundColor="white"
                p="1rem"
                display="flex"
                justifyContent="center"

                sx={{
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                }}
            >
                <Box
                    height="50px"
                    width="100px"
                >
                    <img 
                        src="http://localhost:3001/assets/logo transaparent.png" 
                        alt="logo" 
                        width="100%"
                        height="100%"
                    />
                </Box>
            </Box>

            {/* form box */}
            <Box
                width={isNonMobileScreens ? "50%" : "93%"}
                p="2rem"
                m="2rem auto"
                borderRadius="1.5rem"
                backgroundColor="white"
                sx={{
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
                }}
            >
                <Typography
                    fontWeight="500"
                    variant="h5"
                    color="black"
                    sx={{ mb: "1.5rem", textAlign: "center" }}
                >
                    Welcome to Eventory, the best place to manage and book events!
                </Typography>

                <Form />
            </Box>
        </Box>
    )
}

export default LoginPage