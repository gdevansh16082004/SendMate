const zod = require('zod');

const passwordSchema = zod.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number");

const signup = zod.object({
    username : zod.string().email(),
    password : passwordSchema,
    firstName : zod.string().min(1, "First name is required"),
    lastName : zod.string().min(1, "Last name is required")
})

const signin = zod.object({
    username : zod.string().email(),
    password : zod.string()
})

const updateInformation = zod.object({
    password : passwordSchema.optional(),
    firstName : zod.string().optional(),
    lastName : zod.string().optional()
})

const transferDetails = zod.object({
    to : zod.string(),
    amount: zod.number()
})
module.exports = {
    signup,
    signin,
    updateInformation,
    transferDetails
}