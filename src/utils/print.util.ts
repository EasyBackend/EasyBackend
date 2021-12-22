export const printAsTable = (data: Record<string, any>[]) => {
  // eslint-disable-next-line no-console
  console.table(
    data.reduce((acc, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
};
