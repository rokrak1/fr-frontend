import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
import brain from './Logo.png';

const Logo = () =>{
	return(
		<div className="ma4 mt0">
			<Tilt className="Tilt shadow-2 flex items-center justify-center" options={{ max : 45 }} style={{ height: 250, width: 250 }} >
			 <div className="Tilt-inner pa3"><img style={{width:100,height:100}}alt="logo" src={brain} /></div>
			</Tilt>
		</div>
		);
}
export default Logo;