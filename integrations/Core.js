export async function SendEmail({ to, subject, body, from_name }) {
  console.log('Mock SendEmail:', { to, subject, body: body?.slice(0, 120) + '...', from_name });
  return { success: true, id: `mail-${Date.now()}` };
}

export default { SendEmail };

