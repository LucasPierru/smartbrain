import React from 'react';

const FaceRecognition = ({ imageUrl }) => {
    return (
        <div style={{display: 'flex', justifyContent: 'center'}} className='ma'>
            <div className='absolute mt2'>
                <img src={imageUrl} alt='test' width='500px' height='auto'/>
            </div>
            
        </div>
    );
}

export default FaceRecognition;