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

const initialState = {
			input: '',
			imageUrl: '',
			box: [],
			route: 'signin',
			isSignedIn: false,
			user:{
				id:'',
				name:'',
				email:'',
				entries:0,
				joined:''
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
			isSignedIn: false,
			user:{
				id:'',
				name:'',
				email:'',
				entries:0,
				joined:''
			}
		}
	}

	loadUser = (data) =>{
		this.setState({user:{
				id:data.id,
				name:data.name,
				email:data.email,
				entries:data.entries,
				joined:data.joined
			}})
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
		fetch('http://localhost:3000/imageUrl',{
			method:'post',
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({
				input:this.state.input
			})
		})
		.then(response => response.json())
		.then(resp => {
			console.log(resp);

			if(resp){
				fetch('http://localhost:3000/image',{
					method:'put',
					headers:{'Content-Type':'application/json'},
					body:JSON.stringify({
						id:this.state.user.id
					})
				})
				.then(res => res.json())
				.then(count => {
					this.setState(Object.assign(this.state.user, {entries:count}))
				})
			}

			this.calculateFaceLocation(resp);

		})
		.catch(err => console.log(err));
	}
	onRouteChange = (route) =>{
		if(route === 'signout'){
			this.setState(initialState)
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
			      <Rank name={this.state.user.name} entries={this.state.user.entries} />
			      <ImageLinkForm onChangeInput={this.onChangeInput} onButtonSubmit={this.onButtonSubmit}/>   
			      <FaceRecognition box={box} imageUrl={imageUrl}/>
			    </div>

		       : (
		       	route === 'signin' ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
		       	: (
		       		route === 'signout' ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
		       		: <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
		       		)
		       	)
		  	  }
		    </div>
		 );
	}
  
}

export default App;
