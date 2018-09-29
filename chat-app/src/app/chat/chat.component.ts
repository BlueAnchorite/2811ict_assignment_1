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
      console.log("Chat session started for user: " + this.username);
      this.connection = this.sockServer.getMessages().subscribe(message=>{
        this.messages.push(message);
        this.message = '';
      });
      this.sockServer.joinChannel(this.username);
    }
    
  sendMessage(){
    if (this.message) {
      this.sockServer.sendMessage('[' + this.username + ']: ' + this.message);
    }
  }

  ngOnDestroy(){
    if(this.connection){
      this.sockServer.leftChannel(this.username);
      this.connection.unsubscribe();
    }
  }

  logout(){
    sessionStorage.clear();
    this.router.navigateByUrl('home');
  }
}


