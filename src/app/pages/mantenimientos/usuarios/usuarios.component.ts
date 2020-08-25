import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit, OnDestroy {
  imgSubs: Subscription;
  totalUsuarios = 0;
  usuarios: Usuario[] = [];

  usuariosTemp: Usuario[] = [];

  page = 1;
  totalPages = 0;
  cargando = true;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalService.nuevaImagen.subscribe((img) => {
      this.cargarUsuarios();
    });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .cargarUsuarios(this.page)
      .subscribe(({ total, usuarios }) => {
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;

        this.totalUsuarios = total;
        this.totalPages = Math.ceil(this.totalUsuarios / 5);
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.page += valor;
    if (this.page < 1) {
      this.page = 1;
    } else if (this.page >= this.totalPages) {
      this.page = this.totalPages;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (!termino || termino.length == 0) {
      this.usuarios = this.usuariosTemp;
      return;
    }
    this.busquedasService
      .buscar('usuarios', termino)
      .subscribe((resp: Usuario[]) => {
        this.usuarios = resp;
        console.log(resp);
      });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario).subscribe((res) => {
      console.log(res);
    });
  }

  elimiarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.usuario.uid) {
      return;
    }
    Swal.fire({
      title: 'Estas seguro?',
      text: `Esta apunto de borrar a ${usuario.nombre}!`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
    }).then((result) => {
      if (result.value) {
        this.usuarioService.elimiarUsuario(usuario.uid).subscribe(() => {
          Swal.fire(
            'Usuario borrado',
            `${usuario.nombre} fue eliminado corectamente`,
            'success'
          );
          this.cargarUsuarios();
        });
      }
    });
  }

  abrirModal(usuario: Usuario) {
    this.modalService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
