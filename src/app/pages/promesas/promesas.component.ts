import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    /*  const promesa = new Promise((resolve) => {
       resolve('Hola mundo')
 
     })
     promesa.then(() => {
       console.log("hey termine");
 
     })
     console.log("fin del init"); */
    this.getUsuarios().then(usuarios => {
      console.log(usuarios);

    })
  }

  getUsuarios() {
    return new Promise(resolve => {
      fetch('https://reqres.in/api/users')
        .then((res) => res.json())
        .then(body => resolve(body.data))
    })

  }

}
