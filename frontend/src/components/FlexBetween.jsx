// NOT SURE IF WE NEED THIS FILE, TAKEN FROM TUTORIAL

import { Box } from "@mui/material";
import styled from "@emotion/styled";

const FlexBetween = styled(Box)(({ direction = "row" }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: direction
}))

export default FlexBetween