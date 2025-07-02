
// API route for parts

// This is example inventory data. You'll want to replace this with a connection
// to your actual database or inventory source.
const parts = [
    { year: "2021", manufacturer: "Toyota", model: "Camry", partNumber: "12345", description: "Front bumper" },
    { year: "2020", manufacturer: "Honda", model: "Civic", partNumber: "67890", description: "Rear brake pads" },
    { year: "2022", manufacturer: "Ford", model: "Mustang", partNumber: "54321", description: "Headlight assembly" },
    { year: "2019", manufacturer: "Chevrolet", model: "Silverado", partNumber: "98765", description: "Tailgate handle" },
    { year: "2023", manufacturer: "BMW", model: "X5", partNumber: "13579", description: "Grille assembly" },
];

export async function GET() {
  return new Response(JSON.stringify([]), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
