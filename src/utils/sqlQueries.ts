import { returnColsFromPosts } from "src/constants"

export const queryAllPosts = (limit: number, offset: number) => `
    select ${returnColsFromPosts}, count(l."postId") likes 
    from post p
    left join post_like l on l."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    group by p."postId", p.title, p.body, p."createdAt", b."boardId", b."boardName", creatorId, u.username, p.category
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsFromCreatorId = (creatorId: number, limit: number, offset: number) => `
    select ${returnColsFromPosts}, count(l."postId") likes 
    from post p
    left join post_like l on l."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    where u.id = ${creatorId}
    group by p."postId", p.title, p.body, p."createdAt", b."boardId", b."boardName", creatorId, u.username, p.category
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsFromUsername = (username: string, limit: number, offset: number) => `
    select ${returnColsFromPosts}, count(l."postId") likes 
    from post p
    left join post_like l on l."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    where u.username = '${username}'
    group by p."postId", p.title, p.body, p."createdAt", b."boardId", b."boardName", creatorId, u.username, p.category
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsFromFollowed = (userId: number, limit: number, offset: number) => `
    select ${returnColsFromPosts}, count(l."postId") likes
    from follow f
    inner join board b on f."boardId" = b."boardId"
    inner join post p on p."boardId" = b."boardId"
    inner join "user" u on u."id" = p."creatorId"
    left join post_like l on l."postId" = p."postId"
    where f."userId" = ${userId}
    group by p."postId", p.title, p.body, p."createdAt", 
    b."boardId", b."boardName", creatorId, u.username,
    p.category
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`