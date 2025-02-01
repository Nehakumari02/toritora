import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, password } = await req.json();
  console.log(username,password,"username and password from request")

  // Simulate login success (you would typically verify username and password here)
  try {
    // Validate the user credentials (for simplicity, let's assume the user is valid)
    if (username === 'user' && password === 'password') { // Replace with your actual validation logic

      // Create a payload (e.g., user information) to be stored in the token
      const payload = { username };

      // Generate a JWT token (you can add more data in the payload as needed)
      const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });

      // Set the cookie with HttpOnly, Secure, and SameSite attributes
      const cookie = `toritoraAuth=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`; // Max-Age set to 1 hour

      return new Response(JSON.stringify({ message: 'Login Successful' }), {
        status: 200,
        headers: {
          'Set-Cookie': cookie, // Send the cookie to the client
          'Content-Type': 'application/json', // Ensure the response is in JSON format
        },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Invalid Credentials' }), {
        status: 401,
      });
    }
  } catch (error) {
    console.log("error",error)
    return new Response(JSON.stringify({ error: 'Error' }), {
      status: 500,
    });
  }
}
