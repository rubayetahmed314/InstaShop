import React from "react";

const ColoredHR = ({ color = "darkblue" }) => (
    <hr
        style={{
            color: color,
            backgroundColor: color,
            height: 5,
        }}
    />
);

export default ColoredHR;
