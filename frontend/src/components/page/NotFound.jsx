// import { Link } from "react-router-dom";
import React from "react";
import { useState, useEffect } from "react";

const NotFound = () => {
    useEffect(() => {
        window.location.href="/login";
    }, []);
    return (
        <React.StrictMode>
        </React.StrictMode>
    );
}

export default NotFound;