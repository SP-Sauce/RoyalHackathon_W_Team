import React, { useState } from 'react'
import '../index.css'

const Slider = ({ min, max, value, onChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);

    const handleSlide = (e) => {
        const newValue = parseInt(e.target.value, 10);
        setCurrentValue(newValue);
        onChange(newValue);
    };

    const startDrag = () => setIsDragging(true);
    const stopDrag = () => setIsDragging(false);

    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            setCurrentValue(newValue);
            onChange(newValue);
        }
    };

    return (
        <div className="single-slider-box">
            <div className="input-box">
                <input
                    type="number"
                    value={currentValue}
                    onChange={handleInputChange}
                    className="value-input"
                    min={min}
                    max={max}
                />
            </div>
            <div className="range-slider">
                <div 
                    className="slider-track"
                    style={{
                        background: `linear-gradient(to right, #6c4b0a ${(currentValue - min) / (max - min) * 100}%, #d1d1d1 0%)`
                    }}
                ></div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={currentValue}
                    onChange={handleSlide}
                    onMouseDown={startDrag}
                    onMouseUp={stopDrag}
                    onTouchStart={startDrag}
                    onTouchEnd={stopDrag}
                    className="slider-input"
                />
                {isDragging && (
                    <div 
                        className="value-tooltip"
                        style={{
                            left: `${(currentValue - min) / (max - min) * 100}%`
                        }}
                    >
                        £{currentValue}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Slider;