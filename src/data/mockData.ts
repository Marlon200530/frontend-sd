export const APP_NAME = "Nhluvuko";
export const APP_TAGLINE =
  "Partilha recursos. Poupa custos. Faz a comunidade crescer.";

export const categories = [
  "Livros",
  "Apontamentos",
  "Equipamentos",
  "Calculadoras",
  "Tecnologia",
  "Outros",
];
export const availability = ["Todos", "Disponível", "Requisitado"];

export const initialUsers = [
  {
    id: "u1",
    name: "Marlon Nhantumbo",
    email: "marlon@student.ac.mz",
    password: "12345678",
    role: "student",
    contact: "+258 84 000 0000",
    photo: "MN",
    active: true,
    joinedAt: "2026-04-12T08:30:00",
  },
  {
    id: "u2",
    name: "Ana Macuácua",
    email: "ana@student.ac.mz",
    password: "12345678",
    role: "student",
    contact: "+258 85 222 1111",
    photo: "AM",
    active: true,
    joinedAt: "2026-04-13T09:45:00",
  },
  {
    id: "u3",
    name: "Administrador Académico",
    email: "admin@nhluvuko.ac.mz",
    password: "12345678",
    role: "admin",
    contact: "+258 82 333 7777",
    photo: "AD",
    active: true,
    joinedAt: "2026-04-10T10:00:00",
  },
];

export const initialResources = [
  {
    id: "r1",
    title: "Livro de Algoritmos e Estruturas de Dados",
    description:
      "Livro ideal para quem está a preparar testes de programação, com exercícios e exemplos práticos.",
    category: "Livros",
    status: "Disponível",
    location: "Biblioteca central",
    ownerId: "u2",
    createdAt: "2026-04-28T12:15:00",
    image: "book",
    visible: true,
  },
  {
    id: "r2",
    title: "Calculadora científica Casio fx-991",
    description:
      "Calculadora para disciplinas de Matemática, Física e Estatística.",
    category: "Calculadoras",
    status: "Requisitado",
    location: "Bloco B, sala 12",
    ownerId: "u1",
    createdAt: "2026-04-27T16:40:00",
    image: "calculator",
    visible: true,
  },
  {
    id: "r3",
    title: "Apontamentos de Base de Dados",
    description:
      "Resumo sobre SQL, normalização, transacções e modelação relacional.",
    category: "Apontamentos",
    status: "Disponível",
    location: "Campus principal",
    ownerId: "u1",
    createdAt: "2026-04-29T08:05:00",
    image: "notes",
    visible: true,
  },
  {
    id: "r4",
    title: "Cabo HDMI para apresentações",
    description: "Útil para apresentações em salas com projector.",
    category: "Equipamentos",
    status: "Disponível",
    location: "Laboratório de informática",
    ownerId: "u2",
    createdAt: "2026-04-26T11:20:00",
    image: "equipment",
    visible: true,
  },
  {
    id: "r5",
    title: "Manual de Redes de Computadores",
    description:
      "Material de apoio sobre TCP/IP, routing, DNS e segurança de redes.",
    category: "Livros",
    status: "Disponível",
    location: "Secretaria académica",
    ownerId: "u2",
    createdAt: "2026-04-25T15:10:00",
    image: "network",
    visible: true,
  },
];

export const initialLoans = [
  {
    id: "l1",
    resourceId: "r2",
    borrowerId: "u2",
    requestedAt: "2026-04-28T09:00:00",
    dueDate: "2026-05-05",
    returnedAt: null,
    status: "Activa",
  },
];



