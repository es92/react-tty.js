
import React, { Component } from 'react';

import getTTY from './tty-wrapped.js'

import './style.css'

let [ tty, initialTTYOpen ] = getTTY();

export function _getTTY(){
  return tty;
}

initialTTYOpen('http://localhost:8090/');

export default class TTY extends Component {
  componentDidMount(){

    this._mkWindow();

    let s = {};
    
    let fix_size = false;

    function resize_to_size(){
      this._syncWindowSize();
    }

    function check_resize(){
      if (this.tty.clientWidth !== s.last_width || s.last_height !== this.tty.clientHeight){
        resize_to_size.bind(this)();
      }

      s.last_width = this.tty.clientWidth;
      s.last_height = this.tty.clientHeight;
    }

    function add_mutation_resize_check(elem){
      (new MutationObserver(function(mutations){
          if (mutations.length > 0) { 
            check_resize.bind(this)(); 
          }
      }.bind(this))).observe(elem, { attributes : true, attributeFilter : ['style'] });
    }

    this.window_resize_listener = check_resize.bind(this)

    if (!fix_size){
      window.addEventListener('resize', this.window_resize_listener);
      var elem = this.tty;
      do {
        add_mutation_resize_check.bind(this)(elem);
        elem = elem.parentNode;
      } while (elem != null);
    }

  }
  componentWillUnmount() {
    this._closed = true;
    this._win.destroy();
    window.removeEventListener('resize', this.window_resize_listener);
  }
  _syncWindowSize(){
    var newHeight = this.tty.clientHeight;
    var newWidth = this.tty.clientWidth;

    let lostHeight = 15 + 10;
    let lostWidth = 10;

    var newCols = Math.floor((newWidth - lostWidth) / this.pix_per_col);
    var newRows = Math.floor((newHeight - lostHeight) / this.pix_per_row);

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


    this.pix_per_col = this._win.element.clientWidth / this._win.cols;
    this.pix_per_row = this._win.element.clientHeight / this._win.rows;

    this._syncWindowSize()

    tty.on('reset', function(){
      this._mkWindow();
    }.bind(this));

    win.on('close', function(){
      if (!this._closed)
        this.props.onClose();
    }.bind(this));
  }
  render(){
    return <div ref={ (r) => this.tty = r } className="tty" style={{position: 'absolute', 'left': 0, 'right': 0, top: 0, bottom: 0 }}>
           </div>
  }
}
