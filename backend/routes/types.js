const zod = require('zod');

const signup = zod.object({
    username : zod.string().email(),
    password : zod.string(),
    firstName : zod.string(),
    lastName : zod.string()
})

const signin = zod.object({
    username : zod.string().email(),
    password : zod.string()
})

const updateInformation = zod.object({
    password : zod.string().optional(),
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