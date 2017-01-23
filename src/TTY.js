
import React, { Component } from 'react';

import getTTY from './tty-wrapped.js'

import './style.css'

let [ tty, initialTTYOpen ] = getTTY();

initialTTYOpen('http://localhost:8090/');

export default class TTY extends Component {
  componentDidMount(){
    setTimeout(() => {
      this._mkWindow();
    }, 1000);
  }
  _syncWindowSize(){
    var oldWidth = this._win.element.clientWidth;
    var oldHeight = this._win.element.clientHeight;

    var oldCols = this._win.cols;
    var oldRows = this._win.rows;

    var newHeight = this.tty.clientHeight;
    var newWidth = this.tty.clientWidth;

    var newCols = Math.floor(newWidth / oldWidth * oldCols);
    var newRows = Math.floor(newHeight / oldHeight * oldRows);

    this._win.resize(newCols, newRows);
  }
  focus(){
    this._win.focused.focus();
    this._win.focused.element.focus();
  }
  keypress(charCode){
    this._win.focused.keyPress({ charCode: charCode })
  }
  _mkWindow(){
    var win = new tty.Window();
    this._win = win;

    win.element.parentNode.removeChild(win.element);

    var grip = win.element.querySelector('.grip');
    grip.parentNode.removeChild(grip);

    this.tty.appendChild(win.element);
    //win.element.querySelector('.terminal').setAttribute("contenteditable", "true");

    var isIPhone = ~navigator.userAgent.indexOf('iPhone');
    if (isIPhone)
      win.element.classList.add('ios-term');

    this._syncWindowSize()

    win.on('close', function(){
      this._mkWindow();
    }.bind(this));
  }
  render(){
    return <div ref={ (r) => this.tty = r } className="tty" style={{position: 'absolute', 'left': 0, 'right': 0, top: 0, bottom: 0 }}>
           </div>
  }
}
