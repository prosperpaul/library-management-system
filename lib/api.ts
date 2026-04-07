// // const API_URL = process.env.NEXT_PUBLIC_API_URL;

// // export const api = {
// //   // Authors
// //   getAuthors: () => fetch(`${API_URL}/authors`).then(res => res.json()),
// //   createAuthor: (data: any) => fetch(`${API_URL}/authors`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   }).then(res => res.json()),

// //   // Books
// //   getBooks: () => fetch(`${API_URL}/books`).then(res => res.json()),
// //   createBook: (data: any) => fetch(`${API_URL}/books`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   }).then(res => res.json()),
// //   borrowBook: (id: string, data: any) => fetch(`${API_URL}/books/${id}/borrow`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   }).then(res => res.json()),
// //   returnBook: (id: string) => fetch(`${API_URL}/books/${id}/return`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //   }).then(res => res.json()),

// //   // Students
// //   getStudents: () => fetch(`${API_URL}/students`).then(res => res.json()),
// //   createStudent: (data: any) => fetch(`${API_URL}/students`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   }).then(res => res.json()),

// //   // Attendants
// //   getAttendants: () => fetch(`${API_URL}/attendants`).then(res => res.json()),

// //   // Auth
// //   login: (data: any) => fetch(`${API_URL}/auth/login`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify(data),
// //   }).then(res => res.json()),
// // };


// const getToken = () => localStorage.getItem("token");

// export const api = {
//   get: async (endpoint: string) => {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       headers: { Authorization: `Bearer ${getToken()}` },
//     });
//     return res.json();
//   },
//   post: async (endpoint: string, body: object, auth = true) => {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(auth && { Authorization: `Bearer ${getToken()}` }),
//       },
//       body: JSON.stringify(body),
//     });
//     return res.json();
//   },
//   // same pattern for put and delete...
// };

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://library-system-jwtz.onrender.com";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },

  post: async (endpoint: string, body: Record<string, unknown>, auth = true) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(auth && { Authorization: `Bearer ${getToken()}` }),
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  put: async (endpoint: string, body: Record<string, unknown>) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  delete: async (endpoint: string) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.json();
  },
};