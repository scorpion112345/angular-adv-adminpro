import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit, OnDestroy {
  imgSubs: Subscription;
  medicos: Medico[];
  cargando = true;

  constructor(
    private medicosService: MedicoService,
    private modalService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalService.nuevaImagen.subscribe((img) => {
      this.cargarMedicos();
    });
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarMedicos() {
    this.cargando = true;

    this.medicosService.cargarMedicos().subscribe((medicos) => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Esta apunto de borrar a ${medico.nombre}!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.value) {
        this.medicosService.eliminarMedico(medico._id).subscribe(() => {
          this.cargarMedicos();
          Swal.fire(
            'Medico borrado',
            `${medico.nombre} fue eliminado corectamente`,
            'success'
          );
        });
      }
    });
  }

  buscar(termino: string) {
    if (!termino || termino.length == 0) {
      this.cargarMedicos();
      return;
    }
    this.busquedasService.buscar('medicos', termino).subscribe((resp) => {
      this.medicos = resp;
    });
  }

  abrirModal(medico: Medico) {
    this.modalService.abrirModal('medicos', medico._id, medico.img);
  }
}
