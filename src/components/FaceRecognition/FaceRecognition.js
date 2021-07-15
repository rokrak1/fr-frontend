import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({imageUrl,box}) =>{
	return(
		<div className="center ma">
			<div className="absolute mt2">
				<img id="faceImage" alt="faceRecImage" src={imageUrl} width='600px' height='auto'/>
				{box.map((item,index) => (
					<div key={index} className="bounding-box" style={{top:item.topRow,right:item.rightCol,bottom:item.bottomRow,left:item.leftCol}}></div>
				))}
			</div>
		</div>
		);
}
export default FaceRecognition;