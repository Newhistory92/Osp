import React from "react";

export interface Publicacion {
    id:Number;
    titulo: string;
    contenido: string;
    published: string;
}
export interface PublicacionEdit {
  updatedAt: string | number | Date;
  autor: any;
  id: number;
  titulo: string;
  contenido: string;
  
}

export interface NavbarState {
    showPrestadores: boolean;
    selectedContent: string | null; 
    showWelcome: boolean;
    publicaciones: Publicacion[];
  }


  export interface UserInfo {
    Localidad?: any;
    Domicilio?: any;
    operador: any;
    id: string;
    name: string;
    apellido?: string;
    email: string;
    checkedPhone:boolean;
    phone: string | null;
    phoneOpc?: string;
    imageUrl: string;
    matricula?: string;
    dni?: string;
    numeroOperador?: string;
    role: string;
    address?: string | null;
    prestador:string
    especialidad?: string;
    especialidad2?:string;
    especialidad3?:string;
    dependencia?: string;
    tipo?: string | null;
    descripcion:string
  }

  export interface UserState {
    currentUser: UserInfo | null;
    errorMessage: string | null;
    successMessage:string | null;
   
  }

  export interface GrupData {
    VTOParcial: string | null;
    Motivo: string;
    FecVenciCarnet: string;
    Codigo: string;
    CarnetVencimiento: string;
    FecNac: string;
    FecAlt: string;
    Fechabaja: string;
    razonBaja: string;
    CarnetVencimientoParcial: string;
    Parentesco: string;
    Nombre: string;
  }

export interface Prestador  {
  denuncias: string;
  id:string,
  imageUrl: string;
  name: string;
  matricula?:string;
  descripcion: string;
  phone: string;
  phoneOpc: string;
  address: string;
  especialidad:string,
  especialidad2?:string,
  especialidad3?:string,
  tipo: string,
  IdPrestador:number,
  email:string,
  checkedPhone:boolean,
  createdAt?: string;
  updatedAt?: string;
  
}


export interface DescriptionProps {
  initialDescription: string;
  onSave: (descripcion: string) => void;
}

export interface Especialidad {
  id: string;
  nombre: string;
}

export interface UserCardProps {
  id:string,
  role: string;
  dependencia?: string;
  dni?: string;
  phone?: string;
  phoneOpc?: string;
  matricula?: string;
  especialidad?: string;
  especialidad2?: string; 
  especialidad3?: string;
  descripcion?: string;
  tipo?: string;
  numeroOperador?: string;
  address?: string;
  checkedPhone:boolean,

}



export interface PaginationButtonsProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  maxPage: number;
  data: any[];
}


export interface PartialUserInfo {
  name: string;
  matricula: string;
  especialidad: string;
  id: string;
  dni: string;
  dependencia:string;
  operador: string;
  tipo:string | null;
  address:string | null
  phone: string | null;
  
}

export interface PropsNavbarVertical {
  onProfileClick: () => void;
  onSettingClick: () => void;
  onFamilyGroupClick: () => void;
  onOrdenesClick: () => void; 
  onPublicacionClick:() => void;
  onDenunciaClick:()=> void;
  onNotificadorClick:()=> void;
  onAuditorClick:()=> void;
}

export interface OrdenData {
  IdFacturacion:string;
  Cantidad: number;
  EspecialidadEfector: string;
  NombrePractica: string;
  Nombre: string;
  NombreEfector: string;
  FechaEfectua: string;
  Numero:string;
  Efector:string
}
export interface DenunciaProps {
    closeModal: () => void;
    NombreEfector: string;
    EspecialidadEfector: string;
    NombrePractica: string;
    FechaEfectua: string;
    IdFacturacion:string;
    Efector:string
    onSuccess: () => void;
}



export interface NuevaPublicacion {
  titulo: string;
  contenido: string;
  autorId: string;
}

export interface Denuncia {
  id: string;
  motivo: string;
  autor: string;
  createdAt: string;
  prestador: string;
  status: string;
}

export interface Afiliado {
  id: string;
  name: string;
  apellido: string;
  email: string;
  dni: string;
  phone: string;
  address?: string;
  dependencia?:string;
  denuncias?:string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notificador {
  id: string;
  titulo: string;
  contenido: string;
} 


export interface ProfileHeaderProps {
    imageUrl: string;
    name: string;
    email?:string
}

export interface Country {
  name: string;
  flags: { svg: string };
  countryCallingCode: string;
}

export interface Notificacion {
  id: string;
  titulo: string;
  contenido: string;
  autor: string;
  receptor: string;
  status: string;
  createdAt: string | number | Date;
  updatedAt: string | number | Date;
}

export interface NotificationsProps {
  notificaciones: Notificacion[];
  handleButtonClick: (item: Notificacion) => void;
}

export interface QuickMenuDesktopProps {
  newMessagesCount: number;
  notificaciones: Notificacion[];
  handleButtonClick: (item: Notificacion) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}




export interface NavbarStateVertical {
  open: boolean;
  profileOpen: boolean;
  settingOpen: boolean;
  familyGroupOpen: boolean;
  ordenes: boolean;
  publicacionOpen: boolean;
  publicacionedit:boolean;
  denunciaOpen: boolean;
  notificadorOpen: boolean;
  prestadoresOpen: boolean;
  auditorOpen: boolean;
  internadosOpen:boolean,
    autorizacionesOpen:boolean,
    odontologicoOpen:boolean,
    bioquimicosOpen:boolean,
    facturacionOpen:boolean,
    dialisisOpen:boolean,
}






export interface Operador {
  id: string;
  name: string;
  apellido: string;
  email: string;
  phone: string;
  role: string;
  numeroOperador:string;
  createdAt: string;
  updatedAt: string;
}


export interface CarruselItem {
  id: string;
  tituloprincipal: string;
  titulosecundario: string;
  contenido: string;
  urlImagen: string;
}
