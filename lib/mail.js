import { Resend } from "resend"

const resend = new Resend(process.env.RESENT_API_KEY)


export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">Here<a/> to reset password.</p>`
    })
}