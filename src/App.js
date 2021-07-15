import React,{Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

//You need to sign into your Clarifai account to get an APIKey
const app = new Clarifai.App({
 apiKey: 'AUTH_KEY'
});

const particleOptions = {
    particles: {
        number:{
        	value:110,
        	density:{
        		enable:true,
        		value_area:800
        	}
        }
    },
    interactivity: {
    events: {
      onclick: {
        enable: true,
        mode: "push"
      },
      resize: true
    }
  }
}
class App extends Component{

	constructor(props){
		super(props);
		this.state = {
			input: '',
			imageUrl: '',
			box: [],
			route: 'signin',
			isSignedIn: false
		}
	}
	calculateFaceLocation = (data) =>{
		const image = document.getElementById('faceImage');
		const width = Number(image.width);
		const height = Number(image.height);
		const box =[];
		const clarifaiBox2 = data.outputs[0].data.regions;
		clarifaiBox2.forEach(region =>{
			let zac = {
			leftCol: region.region_info.bounding_box.left_col * width,
			topRow: region.region_info.bounding_box.top_row * height,
			rightCol: width - (region.region_info.bounding_box.right_col * width),
			bottomRow:height - (region.region_info.bounding_box.bottom_row *height)
			};
			box.push(zac);
		}
		);
		this.setState({box:box});
	}
	onChangeInput = (event) =>{
		this.setState({input:event.target.value});

	}
	onButtonSubmit = () =>{
		this.setState({imageUrl:this.state.input});
		app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
		.then(resp => this.calculateFaceLocation(resp))
		.catch(err => console.log(err));
	}
	onRouteChange = (route) =>{
		if(route === 'signout'){
			this.setState({isSignedIn:false})
		}else if(route === 'home'){
			this.setState({isSignedIn:true})
		}
		this.setState({route:route})
	}
	render(){
		const { isSignedIn, imageUrl, route, box } = this.state;
		return (
		    <div className="App">
		      <Particles className="particles" params={particleOptions}/>
		      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
		      {route === 'home'
		       ? <div>
			      <Logo />
			      <Rank />
			      <ImageLinkForm onChangeInput={this.onChangeInput} onButtonSubmit={this.onButtonSubmit}/>   
			      <FaceRecognition box={box} imageUrl={imageUrl}/>
			    </div>

		       : (
		       	route === 'signin' ? <SignIn onRouteChange={this.onRouteChange}/>
		       	: <Register onRouteChange={this.onRouteChange} />
		       	)
		  	  }
		    </div>
		 );
	}
  
}

export default App;
