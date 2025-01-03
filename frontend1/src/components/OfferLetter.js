import React from 'react';

const OfferLetter = () => {
    const parent = () => {
        console.log('parent clicked');
    };

    const parentCapture = () => {
        console.log('parent capture');
    };

    const child = () => {
        console.log('child clicked');
    };

    const childCapture = () => {
        console.log('child capture');
    };

    const button1 = () => {
        console.log('button1 clicked');
    };

    const button1Capture = () => {
        console.log('button1 capture');
    };

    const button2 = () => {
        console.log('button2 clicked');
    };

    const button2Capture = () => {
        console.log('button2 capture');
    };

    return (
        <div onClickCapture={parentCapture} onClick={parent}>
            parent
            <div onClickCapture={childCapture} onClick={child}>
                child
                <button onClickCapture={button1Capture} onClick={button1}>
                    button1
                </button>
                <button onClickCapture={button2Capture} onClick={button2}>
                    button2
                </button>
            </div>
        </div>
    );
};

export default OfferLetter;
