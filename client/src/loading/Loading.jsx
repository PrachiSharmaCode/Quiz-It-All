import "./loading.css";
import React from "react";

const Loading = ({ text }) => {
    const numberOfBalls = 5;
    return (
        <div className="loading-container" role="status" aria-live="polite" aria-atomic="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div className="hanger"></div>
            <div className="ball-stick-contaner">
                {
                    Array.from({ length: numberOfBalls }, (_, index) => (
                        <div className="ball-stick" key={index}>
                            <div className="stick"></div>
                            <div className="ball"></div>
                        </div>
                    ))
                }
            </div>
            {text && <p className="app-description" style={{ marginTop: '8px', textAlign: 'center' }}>{text}</p>}
        </div>)
}

export default Loading;
