const apiUrl = "http://localhost:3001"; // Update with your server URL

export const fetchData = async () => {
  const response = await fetch(`${apiUrl}/data`);
  return response.json();
};

export const updateData = async (data) => {
  await fetch(`${apiUrl}/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};
