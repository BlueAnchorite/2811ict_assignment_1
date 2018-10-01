import { Component, OnInit, Input} from '@angular/core';
import { SocketService } from '../socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  @Input() channel;
  username: string;
  messages=[];
  message;
  connection;

  constructor(private sockServer: SocketService, private router:Router) { }

  ngOnInit() {
    let user = JSON.parse(sessionStorage.getItem('user'));
    
      this.username = user.username;
      this.connection = this.sockServer.getMessages().subscribe(message=>{
        this.messages.push(message);
        this.message = '';
      });
      
    }
  
  ngOnChanges(changes: SimpleChanges) {
    if(changes.channel.previousValue){
      //send leave message
      let data = {"channel": changes.channel.previousValue, "username": this.username};
      this.sockServer.leftChannel(data);
      //unsubscribe to old room
      this.sockServer.leaveChannel(data);
    }
    //subscribe to new room
    if(this.channel) {
        let data = {"channel": this.channel, "username": this.username};
        this.sockServer.joinChannel(data);
      }
  }
    
  sendMessage(){
    if (this.message) {
      let data = {"channel": this.channel, "message": '[' + this.username + ']: ' + this.message};
      this.sockServer.sendMessage(data);
    }
  }

  ngOnDestroy(){
    if(this.connection){
      this.connection.unsubscribe();
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('home');
  }
}


