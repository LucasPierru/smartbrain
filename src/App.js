import React, { Component } from 'react'
import Particles from 'react-tsparticles';
import { loadFull } from "tsparticles";
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo';
import Rank from './components/rank/Rank';
import ImageLinkForm from './components/imagelinkform/ImageLinkForm';
import FaceRecognition from './components/facerecognition/FaceRecognition';
import './App.css';

const particlesOptions = {
  particles: {
    links: {
      distance: 250,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
    },
    size: {
      value: 0.5,
    },
  }
}

const particlesInit = async (main) => {
  await loadFull(main);
};

const particlesLoaded = (container) => {
  //console.log(container);
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}
    }
  }
  //regions is an array if you have multiple faces
  calculateFaceLocation = (data) => {
    const clarifaiFace = JSON.parse(data).outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    const raw = JSON.stringify({
      user_app_id : {
        user_id: "luysru7_3635",
        app_id: "smart-brain"
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input
            },
          },
        },
      ],
    });
 
    fetch(
       "https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/outputs",
       {
         method: "POST",
         headers: {
           Accept: "application/json",
           Authorization: "Key c2bb7b98f077494fb99f52b902385a51",
         },
         body: raw,
       }
     )
     .then((response) => response.text())
     .then((result) => this.displayFaceBox(this.calculateFaceLocation(result)))
       //const data = JSON.parse(result).outputs[0].data.regions[0].region_info.bounding_box
     .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <div className="App">
        {/*<Particles className="particles"
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          params={particlesOptions} 
    />*/}
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>    
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
  }
  
}

export default App;
