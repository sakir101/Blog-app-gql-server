import { User } from "@prisma/client";
import { prisma } from "..";
import DataLoader from "dataloader";

const batchUsers = async (ids: number[]): Promise<User[]> => {
    console.log(ids)
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids
            }
        }
    })

    /*
        {
            1: {id: 1, name: Fahim}
            2: {id: 2, name: Faysal}
            3: {id: 3, name: Rafiq}
            5: {id: 5, name: Kabir}
        }

    */

    const userData: { [key: string]: User } = {}

    users.forEach((user) => {
        userData[user.id] = user
    }

    )

    console.log(userData)

    return ids.map((id) => userData[id])
}

//@ts-ignore
export const userLoader = new DataLoader<number, User>(batchUsers)