// app/models.ts
export interface Category {
  id?: string;
  name: string;
}

export interface Local {
  id?: string;
  name: string;
  pickupTime?: string;
  direccion?: string;
  phone?: string;
  email?: string;
  images?: string[]; // array of urls (0..3)
  categoryIds?: string[]; // many-to-many (category <-> local)

  /** El puntaje (lo pondremos manual por ahora) */
  puntaje?: number;
  
  /** El ID del combo que quieres mostrar en la home */
  featuredComboId?: string; 

  /** El PRECIO copiado de ese combo (para mostrar en la lista) */
  featuredComboPrice?: number;
}

export interface Combo {
  id?: string;
  name: string;
  price: number;
  description?: string;
  weight?: number;
  localId?: string;
  categoryId?: string;
}

export interface User {
  id?: string;
  username: string;
  nombre?: string;
  apellido?: string;
  email: string;
  role?: "admin" | "user";
}

export interface Review {
  id?: string;
  userId: string;
  localId: string;
  comentario?: string;
  puntuacion: number;
  createdAt?: any;
}

export interface OrderItem {
  comboId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id?: string;
  userId: string;
  localId: string;
  items: OrderItem[];
  fecha?: any;
  estado?: string;
  total?: number;
}
