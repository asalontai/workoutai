import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)


export const sendPasswordResetEmail = async (email, token) => {
    const resetLink = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/auth/new-password?token=${token}`

    const logo = 'https://zgxzgzoiljrfmmfqpboi.supabase.co/storage/v1/object/sign/Logo/WorkoutAi%20Black.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJMb2dvL1dvcmtvdXRBaSBCbGFjay5wbmciLCJpYXQiOjE3MzEzNDg0MDQsImV4cCI6MTc2Mjg4NDQwNH0.oCrPV-JND5ChFqjjpOZuixoz8EogdVchgv-v7flmwpY&t=2024-11-11T18%3A06%3A44.324Z'

    await resend.emails.send({
        from: "workoutai@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; text-align: center;">
                <img src="${logo}" alt="WorkoutAi Logo" width="200" style="margin-bottom: 20px;"/>
                <h2 style="color: #212121; font-size: 24px;">Password Reset Request</h2>
                <p style="font-size: 16px; color: #555; line-height: 1.5;">
                    We received a request to reset your password. Please click the link below to create a new password.
                </p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; font-size: 16px; border-radius: 5px; margin-top: 20px;">
                    Reset Your Password
                </a>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">
                    If you didn’t request this, please ignore this email. Your password won’t be changed.
                </p>
            </div>
        `,
    })
}