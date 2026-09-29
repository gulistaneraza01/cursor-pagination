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
