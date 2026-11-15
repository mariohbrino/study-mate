import { databaseClient } from "@tests/commons/database";

export const hasTable = async (
  client: Awaited<ReturnType<typeof databaseClient>>,
  tableName: string,
) => {
  const result = await client.execute(
    `
      SELECT
        table_name
      FROM
        information_schema.tables
      WHERE
        table_schema = 'public' AND
        table_name = '${tableName}';
    `,
  );
  return result.rows.length > 0;
};
