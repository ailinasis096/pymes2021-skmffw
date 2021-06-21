import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Empresas } from '../../models/empresas';
import { EmpresasService } from '../../services/empresas.service';
@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {
  Titulo = 'Empresas';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el Listado de empresas (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Empresas[] = null;
  RegistrosTotal: number;
  Empresas: Empresas[] = [];

  Pagina = 1; // inicia pagina 1

  FormRegistro: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private empresasService: EmpresasService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      IdEmpresa: [0],
      RazonSocial: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(50)]
      ],
      CantidadEmpleados: [
        null,
        [Validators.required, Validators.pattern('[0-9]{1,7}')]
      ],
      FechaFundacion: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ]
    });
  }
  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ IdEmpresa: 0 });
    this.submitted = false;
  }

  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
    var arrFecha = itemCopy.FechaFundacion.substr(0, 10).split('/');
    if (arrFecha.length == 3)
      itemCopy.FechaFundacion = new Date(
        arrFecha[2],
        arrFecha[1] - 1,
        arrFecha[0]
      ).toISOString();

    // agregar post
    if (this.AccionABMC == 'A') {
      this.empresasService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
      });
    }
  }
  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    this.empresasService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  // Volver/Cancelar desde Agregar/Modificar/Consultar
  Volver() {
    this.AccionABMC = 'L';
  }
}
