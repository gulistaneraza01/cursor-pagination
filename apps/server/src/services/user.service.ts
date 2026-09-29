import { prisma } from '../../lib/prisma';

export async function seedUsersFromCsv() {
  const csv = await Bun.file('prisma/users.csv').text();
  const [, ...lines] = csv.trim().split('\n');
  const data = lines.map((line) => {
    const [id, name, email] = line.split(',');

    if (id === undefined || name === undefined || email === undefined) {
      throw new Error(`Invalid CSV row: ${line}`);
    }

    return { id, name, email };
  });

  const result = await prisma.user.createMany({ data, skipDuplicates: true });
  return result.count;
}

export async function getUsersPaginated(
  cursor?: string,
  limit = 20,
  sortBy = 'create_at',
  order: 'asc' | 'desc' = 'desc',
) {
  const users = await prisma.user.findMany({
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: [{ [sortBy]: order }, { id: order }],
  });

  const hasMore = users.length > limit;
  const data = hasMore ? users.slice(0, limit) : users;
  const nextCursor = hasMore ? data[data.length - 1]!.id : null;

  return { data, nextCursor };
}
