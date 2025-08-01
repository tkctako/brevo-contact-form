import nodemailer from 'nodemailer'

export async function POST(req) {
  const { name, email, message } = await req.json()

  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
      user: process.env.BREVO_USER, // 你的 Brevo Email
      pass: process.env.BREVO_API_KEY, // 你剛建立的 API Key
    },
  })
  console.log(process.env.BREVO_USER, process.env.BREVO_API_KEY)
  const adminMail = {
    from: `"Website Form" <${process.env.ADMIN_EMAIL}>`,
    to: process.env.ADMIN_EMAIL, // 管理者
    subject: `New message from ${name}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `,
  }

  const userMail = {
    from: `"Your Website" <${process.env.ADMIN_EMAIL}>`,
    to: email, // 寄給使用者
    subject: 'Thanks for contacting us!',
    html: `<p>Hi ${name},<br/>Thanks for reaching out. We'll get back to you soon.</p>`,
  }

  try {
    console.log('Sending admin email to:', process.env.ADMIN_EMAIL)
    const adminResult = await transporter.sendMail(adminMail)
    console.log('Admin email sent successfully:', adminResult.messageId)
    
    console.log('Sending user email to:', email)
    const userResult = await transporter.sendMail(userMail)
    console.log('User email sent successfully:', userResult.messageId)
    
    return new Response('Emails sent', { status: 200 })
  } catch (error) {
    console.error('Email error:', error)
    return new Response('Error sending email', { status: 500 })
  }
}
