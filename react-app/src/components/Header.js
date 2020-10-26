import React from "react";

class Header extends React.Component {
    render() {
    return(
        <h1 style={headerStyle}>This is our Header</h1>
        );
    }
}

const headerStyle = {
    position: "absolute",
    width: "1440px",
    height: "111px",
    left: "0px",
    top: "-17px",
    zIndex: "-1",
    background: "#6C9FF8"
}

export default Header;