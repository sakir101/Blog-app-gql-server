import bcrypt from "bcrypt";
import { jwtHelper } from "../../utils/jwtHelper";
import config from "../../config";



interface userInfo {
    name: string
    email: string
    password: string
    bio?: string
}

export const authResolvers = {
    signup: async (parent: any, args: userInfo, { prisma }: any) => {
        const isExist = await prisma.user.findFirst({
            where: {
                email: args.email
            }
        })

        if (isExist) {
            return {
                userError: "User is already exist",
                token: null
            }
        }
        const hashedPass = await bcrypt.hash(args.password, 12)
        const newUser = prisma.user.create({
            data: {
                name: args.name,
                email: args.email,
                password: hashedPass
            }
        })

        if (args.bio) {
            await prisma.profile.create({
                data: {
                    bio: args.bio,
                    userId: (await newUser).id
                }
            })
        }

        const token = await jwtHelper.generateToken({ userId: (await newUser).id }, config.jwt.secret as string);
        return {
            userError: null,
            token
        }
    },

    signin: async (parent: any, args: any, { prisma }: any) => {
        const user = await prisma.user.findFirst({
            where: {
                email: args.email
            }
        })

        if (!user) {
            return {
                userError: "User not found",
                token: null
            }
        }

        const correctPass = await bcrypt.compare(args.password, user?.password)

        if (!correctPass) {
            return {
                userError: "Password Error",
                token: null
            }
        }
        const token = await jwtHelper.generateToken({ userId: (await user).id }, config.jwt.secret as string)
        return {
            userError: null,
            token
        }
    },
}