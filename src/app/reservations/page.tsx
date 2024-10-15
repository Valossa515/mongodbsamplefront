import React from "react";
import LayoutWithDrawer from "../components/Drawer/LayoutWithDrawer";
import { Typography } from "@mui/material";
import Reserva from "../components/Reservations";

const Reservation: React.FC = () => {
    return (
        <LayoutWithDrawer>
            <Typography variant="h4" className="font-bold mb-8 text-gray-900 dark:text-gray-100">
                Reservas
            </Typography>
            <Reserva />
        </LayoutWithDrawer>
    );
};

export default Reservation;