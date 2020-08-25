import { Component, OnInit, OnDestroy } from '@angular/core';
import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { Subscription } from 'rxjs';
import { BusquedasService } from '../../../services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  imgSubs: Subscription;
  hospitales: Hospital[];
  cargando = true;
  hospitalesTemp: Hospital[] = [];

  constructor(
    private hospitalService: HospitalService,
    private modalService: ModalImagenService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalService.nuevaImagen.subscribe((img) => {
      this.cargarHospitales();
    });
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.cargando = false;
      this.hospitales = hospitales;
      this.hospitalesTemp = hospitales;
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      inputPlaceholder: 'Enter the URL',
      showCancelButton: true,
    });

    if (value.trim().length) {
      this.hospitalService.crearHospital(value).subscribe((res: any) => {
        this.hospitales.push(res.hospital);
      });
    }
  }

  guardarCambios(hospital: Hospital) {
    console.log(hospital);
    this.hospitalService
      .actualizarHospital(hospital._id, hospital.nombre)
      .subscribe((res) => {
        Swal.fire('Actulizado', `${hospital.nombre}`, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Esta apunto de borrar a ${hospital.nombre}!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.value) {
        this.hospitalService.eliminarHospital(hospital._id).subscribe(() => {
          this.cargarHospitales();
          Swal.fire(
            'Hospital borrado',
            `${hospital.nombre} fue eliminado corectamente`,
            'success'
          );
        });
      }
    });
  }

  buscar(termino: string) {
    if (!termino || termino.length == 0) {
      this.hospitales = this.hospitalesTemp;
      return;
    }
    this.busquedasService.buscar('hospitales', termino).subscribe((resp) => {
      this.hospitales = resp;
      console.log(resp);
    });
  }

  abrirModal(hospital: Hospital) {
    this.modalService.abrirModal('hospitales', hospital._id, hospital.img);
  }
}
