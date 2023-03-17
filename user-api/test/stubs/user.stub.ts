import { User } from "src/schemas/user.schema";

export const userStub = (): User => {
    return {
        id: '23343',
        email: 'test@test.com',
        name: 'paliko',
        avatar: 'something.jpg',
        avatarHash: 'lsdljfsldfjslf',
        date_added: 234234234234
    }
}