export async function POST() {
  try {
    // Set the cookie with HttpOnly, Secure, and SameSite attributes, and expire it immediately
    const cookie = `toritoraAuth=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/`;

    return new Response(null, {
      status: 204,
      headers: {
        'Set-Cookie': cookie,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: 'Error' }), {
      status: 500,
    });
  }
}
