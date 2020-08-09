import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  titulo: string = ''
  tituloSubs$: Subscription;

  constructor(private router: Router) {
    this.tituloSubs$ = this.getArguementosRuta()
      .subscribe(({ titulo }) => {
        this.titulo = titulo
        document.title = `AdminPro - ${titulo}`
      });
  }

  getArguementosRuta() {
    return this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild == null),
        map((event) => event.snapshot.data)
      )
  }


  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.tituloSubs$.unsubscribe()
  }

}
