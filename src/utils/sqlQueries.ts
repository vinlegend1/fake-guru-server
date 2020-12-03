import { groupByColsFromPosts, returnColsFromPosts } from "../constants"

export const queryAllPosts = (limit: number, offset: number) => `
    select ${returnColsFromPosts}
    from post p
    left join post_like l on l."postId" = p."postId"
    left join comment c on c."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    group by ${groupByColsFromPosts}
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsGivenBoardId = (boardId: number, limit: number, offset: number) => `
    select ${returnColsFromPosts} from post p
    left join post_like l on l."postId" = p."postId"
    left join comment c on c."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    where b."boardId" = ${boardId}
    group by ${groupByColsFromPosts}
    order by p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsGivenBoardName = (boardName: string, limit: number, offset: number) => `
    select ${returnColsFromPosts} from post p
    left join post_like l on l."postId" = p."postId"
    left join comment c on c."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    where b."boardName" = '${boardName}'
    group by ${groupByColsFromPosts}
    order by p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsFromCreatorId = (creatorId: number, limit: number, offset: number) => `
    select ${returnColsFromPosts}
    from post p
    left join post_like l on l."postId" = p."postId"
    left join comment c on c."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    where u.id = ${creatorId}
    group by ${groupByColsFromPosts}
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsFromUsername = (username: string, limit: number, offset: number) => `
    select ${returnColsFromPosts}
    from post p
    left join post_like l on l."postId" = p."postId"
    left join comment c on c."postId" = p."postId"
    inner join board b on p."boardId" = b."boardId"
    inner join "user" u on p."creatorId" = u.id
    where u.username = '${username}'
    group by ${groupByColsFromPosts}
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`

export const queryAllPostsFromFollowed = (userId: number, limit: number, offset: number) => `
    select ${returnColsFromPosts}
    from follow f
    inner join board b on f."boardId" = b."boardId"
    inner join post p on p."boardId" = b."boardId"
    inner join "user" u on u."id" = p."creatorId"
    left join comment c on c."postId" = p."postId"
    left join post_like l on l."postId" = p."postId"
    where f."userId" = ${userId}
    group by ${groupByColsFromPosts}
    order by likes desc, p."createdAt" desc
    limit ${limit} offset ${offset};
`