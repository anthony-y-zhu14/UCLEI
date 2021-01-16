
import React, { Component } from 'react'
import Lottie from 'react-lottie'
import animationData from './images/lf30_editor_gucsxhof.json'

class UncontrolledLottie extends Component {


  render(){

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return(
      <div>
        <Lottie options={defaultOptions}
              height={250}
              width={250}
        />
      </div>
    )
  }
}

export default UncontrolledLottie
