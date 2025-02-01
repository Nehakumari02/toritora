import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, password } = await req.json();
  console.log(username,password,"username and password from request")

  try {
    if (username === 'user' && password === 'password') {

      const payload = { username };
      const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });

      // Set the cookie with HttpOnly, Secure, and SameSite attributes
      const cookie = `toritoraAuth=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600; Path=/`; // Max-Age set to 1 hour

      return new Response(JSON.stringify({ message: 'Login Successful' }), {
        status: 200,
        headers: {
          'path':'/',
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
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
