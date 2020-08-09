import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  intervalSubs: Subscription;

  constructor() {
    this.intervalSubs = this.retornaIntervalo().subscribe(console.log);

    /* this.retornaObservable().pipe(
      retry(1)
    ).subscribe(
      valor => {
        console.log("subs", valor);
      },
      err => console.warn("error", err),
      () => console.info("terminado")
    ) */
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.intervalSubs.unsubscribe()
  }

  retornaIntervalo(): Observable<number> {
    return interval(100)
      .pipe(
        map(valor => {
          return valor + 1
        }),
        filter((value) => value % 2 === 0),
        //take(10)
      );
  }

  retornaObservable(): Observable<number> {
    let i = 0

    return new Observable<number>(observer => {

      const intervalo = setInterval(() => {

        i++;
        observer.next(i)
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete()
        }
        if (i === 2) {
          observer.error('i llego al valor de 2')
        }
      }, 1000)
    });
  }



}
