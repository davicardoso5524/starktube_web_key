async function test() {
  try {
    const res = await fetch("http://localhost:3000/api/api-licenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", machineCode: "AAA- BBB", validityDays: 30 }),
    });
    
    // Read the response regardless of status
    const data = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
test();
