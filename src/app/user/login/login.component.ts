import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { bufferToggle } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials ={
    email:'',
    password:''
  }
  constructor(private auth: AngularFireAuth) { }
showAlert = false;
alertMsg = 'Please wait! We are logging you in.';
alertColor = 'blue';
isSubmission = false;

  ngOnInit(): void {
  }

  async login() {
    this.showAlert = true;
    this.alertMsg = 'Please wait! We are logging you in.';
    this.alertColor = 'blue'
    this.isSubmission = true
    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    } catch (error) {
      this.isSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'An unexpected error occured. Please try again'
      console.log(error)
      return
    }
    this.alertMsg = 'Success! You are now logged in.';
    this.alertColor = 'green';
  }

}
