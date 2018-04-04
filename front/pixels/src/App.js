import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client';

class App extends Component {

  state={
    context:null,
    pixelSize:3,
    color:'#FFF'
  }

  pixels=[];
  
  componentDidMount(){
    this.socket = socketIOClient(process.env.REACT_APP_SOCKET_BACKEND);
    this.socket.on('render pixel',(pixels)=>{
      this.pixels=pixels;
      this.renderPixels();
    });
    this.refs.canvas.width=window.innerWidth-20;
    this.refs.canvas.height=window.innerHeight-20;
    this.setState({context:this.refs.canvas.getContext('2d'),color:'#'+(Math.random()*0xFFFFFF<<0).toString(16)});
  }

  renderPixels = () =>{
    if(this.state.context!=null){
      let c=this.state.context;
      this.pixels.map(pixel=>{
        c.fillStyle=pixel.color;
        c.fillRect(pixel.x,pixel.y,this.state.pixelSize,this.state.pixelSize);
      })
    }
  }

  elMouse = (evt) =>{
    console.log(evt.clientX,evt.clientY);
    this.socket.emit('add pixel',{
      x:evt.clientX-10,
      y:evt.clientY-10,
      color:this.state.color
    });
  }

  render() {
    this.renderPixels()
    return (
      <canvas ref="canvas" className="el-canvas" onClick={(evt)=>this.elMouse(evt)}/>
    );
  }
}

export default App;
