import { db } from "@/lib/db";

export async function POST(req) {
    try {
        const testToken = await db.passwordResetToken.create({
          data: {
            email: 'test@example.com',
            token: 'test-token',
            expires: new Date(new Date().getTime() + 3600 * 1000),
          },
        });
        console.log('Test Token Created:', testToken);
    } catch (error) {
        console.error('Error Creating Test Token:', error);
    }      
}