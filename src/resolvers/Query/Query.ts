export const Query = {
    me: async (parent: any, args: any, { prisma, userInfo }: any) => {
        return await prisma.user.findUnique({
            where: {
                id: userInfo.userId
            }
        })
    },

    profile: async (parent: any, args: any, { prisma, userInfo }: any) => {
        return await prisma.profile.findUnique({
            where: {
                userId: Number(args.userId)
            }
        })
    },

    users: async (parent: any, args: any, { prisma }: any) => {
        return await prisma.user.findMany()
    },

    user: async (parent: any, args: any, { prisma }: any) => {
        const userId = parseInt(args.userId)
        return await prisma.user.findFirst({
            where: {
                id: userId
            }
        })
    },

    posts: async (parent: any, args: any, { prisma }: any) => {
        console.log("post")
        return await prisma.post.findMany({
            where: {
                published: false
            },
            orderBy: [
                {
                    createdAt: "desc"
                }
            ]
        })
    }
}