// app/productsData.ts
export const products = [
  {
    id: "1",
    name: "Pizza Popeye's",
    price: 7500,
    description: "El combo puede venir con distintas porciones de pizza. De muzarella, fugazzetta, Pepperoni, entre otras ",
    image: require("../assets/images/pizza-margarita-v2.jpg"),
    pickupTime: "12:00 - 22:00",
    direccion: "Calle 60 1862, La Plata",
    puntaje: 4.2,
  },
  {
    id: "2",
    name: "César's Palace",
    price: 8300,
    description: "El combo incluye una ensalada de las siguientes variedades: César, Mediterránea o Waldorf ",
    image: require("../assets/images/ensalada-cesar-v4.jpg"),
    pickupTime: "12:30 - 16:00",
    direccion: "Calle 4 1172, La Plata",
    puntaje: 3.9,
  },
  {
    id: "3",
    name: "The Cozy Corner",
    price: 5000,
    description: "El paquete de panificados puede incluir: facturas, porciones de tortas o bizcochos",
    image: require("../assets/images/bakery-v4.jpg"),
    pickupTime: "10:30 - 20:00",
    direccion: "Calle 54 1514, La Plata",
    puntaje: 4.4,
  },
];
