import React from "react";

const PFPBox = () => {
    return (
        <>
            <div style={{background: "#e4e4e7", position: "relative"}} className="h-[30rem] rounded-3xl p-8">
                <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/pfp.png')", backgroundSize: "cover", backgroundPosition: "center"}} />
            </div>
        </>
    )
}

export default PFPBox