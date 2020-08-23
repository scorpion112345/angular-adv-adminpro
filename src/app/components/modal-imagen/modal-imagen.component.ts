import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir;
  public imgTemp: any;

  constructor(
    public modalService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.modalService.cerrarModal();
    this.imgTemp = null;
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;
    if (!file) {
      this.imgTemp = null;
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  actualizarImagen() {
    if (!this.imagenSubir) {
      return;
    }
    const id = this.modalService.id;
    const tipo = this.modalService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((img) => {
        if (img) {
          Swal.fire('Guardado', 'Imagen actualizada con éxito', 'success');
        } else {
          Swal.fire('Error', 'Error al actualizar imagen', 'error');
        }
        this.modalService.nuevaImagen.emit(img);
        this.cerrarModal();
      });
  }
}
