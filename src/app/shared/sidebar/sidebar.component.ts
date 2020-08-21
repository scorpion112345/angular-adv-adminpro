import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  usuario: Usuario;
  nombre = '';

  constructor(
    private sidebarSerice: SidebarService,
    private usuarioService: UsuarioService
  ) {
    this.menuItems = sidebarSerice.menu;
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {}
}
