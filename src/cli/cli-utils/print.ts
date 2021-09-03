export const printAsTable = (data: any[]) => {
  // TODO: Get rid of this "any" ^^^^
  console.table(
    // TODO: get rid of this "any" vvvv
    data.reduce((acc: any, { action, ...x }) => {
      acc[action] = x;
      return acc;
    }, {})
  );
};
