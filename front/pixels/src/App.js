import React, { Component } from 'react';
import './App.css';
import socketIOClient from 'socket.io-client';
import axios from 'axios';

class App extends Component {

  //Estado de la App
  state={
    context:null,
    pixelSize:3,
    color:'',
    inputValue:''
  }

  pixels=[];
  

  componentDidMount(){

    axios.get(process.env.REACT_APP_SOCKET_BACKEND+'/state')
    .then((resp)=>{
      this.pixels=resp.data;
      this.renderPixels();
    })
    .catch((err)=>{
      console.log('errrroooorrrr',err); 
    });

    this.socket = socketIOClient(process.env.REACT_APP_SOCKET_BACKEND);
    this.socket.on('render pixel',(pixels)=>{
      this.pixels.push(pixels);
      this.renderPixels();
    });
    this.refs.canvas.width=window.innerWidth-20;
    this.refs.canvas.height=window.innerHeight-20;
    this.setState({context:this.refs.canvas.getContext('2d')}); //color:'#'+(Math.random()*0xFFFFFF<<0).toString(16)}
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
    if(this.state.color!==''){
      this.socket.emit('add pixel',{
        x:evt.clientX-10,
        y:evt.clientY-55,
        color:this.state.color
      });
    }
    else{
      alert('no tienes usuario compa!');
    }
  }

  handleButton = () => {
    if(this.state.inputValue.length>0){
      axios({
        method:'post',
        url:process.env.REACT_APP_USER_BACKEND+'/user',
        data:{user:this.state.inputValue},
        headers:{'Content-Type': 'application/json'}
      }).then((resp)=>{
        this.setState({color:resp.data.color,inputValue:''});
      }).catch((err)=>{
        alert(err);
      })
      
    }
  }

  render() {
    this.renderPixels()
    return (
      <div>
        <input value={this.state.inputValue} onChange={evt =>this.setState({inputValue: evt.target.value})}/>
        <button onClick={()=>{this.handleButton()}}>Go!</button>
        <canvas ref="canvas" className="el-canvas" onClick={(evt)=>this.elMouse(evt)}/>
      </div>
    );
  }
}

export default App;
