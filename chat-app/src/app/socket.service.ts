import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})

export class SocketService {
  private url = 'http://ryoma-assignment1-blueanchorite.c9users.io:8080';
  private socket;
  
  constructor() { 
  } 

  joinChannel(username){
    this.socket.emit('join-message', username);
  }
  
  leftChannel(username){
    this.socket.emit('left-message', username);
  }

  sendMessage(message){
    this.socket.emit('add-message', message);
  }

  getMessages(){
    console.log('getMessages()');
    this.socket = io(this.url);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('message', (data) => {
          console.log("Received message from Websocket Server")
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We return our observable
    return observable;
  }
}