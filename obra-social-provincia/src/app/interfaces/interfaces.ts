

export interface Publicacion {
    id:Number;
    titulo: string;
    contenido: string;
    published: string;
}

export interface NavbarState {
    showPrestadores: boolean;
    selectedContent: string | null; 
    showWelcome: boolean;
    publicaciones: Publicacion[];
  }


  export interface UserInfo {
    operador: any;
    splice(arg0: number[]): unknown;
    
    id: string;
    name: string;
    apellido?: string;
    email: string;
    checkedphone:boolean;
    phone: string;
    phoneopc?: string;
    imageUrl: string;
    matricula?: string;
    dni?: string;
    numeroOperador?: string;
    role: string;
    address: string;
    prestador:string
    especialidad?: string;
    especialidad2?:string;
    especialidad3?:string;
    dependencia?: string;
    tipo:string
    descripcion:string
  }

  export interface UserState {
    currentUser: UserInfo | null;
    loading: boolean;
    errorMessage: string | null;
  }

export interface Prestador {
  id:string,
  imageUrl: string;
  name: string;
  apellido: string;
  descripcion: string;
  phone: string;
  phoneopc: string;
  address: string;
  especialidad:string,
  especialidad2:string,
  especialidad3:string,
  tipo: string,
  email:string,
  checkedphone:boolean,
  coordinatesLat:Number, 
  coordinatesLon: Number,
}


export interface DescriptionProps {
  initialDescription: string;
  onSave: (descripcion: string) => void;
}

export interface Especialidad {
  id: number;
  nombre: string;
}

export interface UserCardProps {
  id:string,
  role: string;
  dependencia?: string;
  dni?: string;
  phone?: string;
  phoneopc?: string;
  matricula?: string;
  especialidad?: string;
  especialidad2?: string; 
  especialidad3?: string;
  puntuacion?: string;
  descripcion?: string;
  tipo?: string;
  numeroOperador?: string;
  address?: string;
  checkedphone:boolean,

}