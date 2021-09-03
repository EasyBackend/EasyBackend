import inquirer from "inquirer";

export const deleteFromListCLI = async (props: string[]) => {
  const filterArrFromArray = (original: any[], toFilter: any[]) => {
    return original.filter((item) => !toFilter.includes(item));
  };
  const deletePropsQuestions = {
    delete: { type: "checkbox", name: "toDelete", choices: props, loop: true },
    confirm: {
      type: "confirm",
      name: "confirmDelete",
    },
  };
  const { toDelete } = await inquirer.prompt([deletePropsQuestions.delete]);
  const { confirmDelete } = await inquirer.prompt([
    deletePropsQuestions.confirm,
  ]);
  if (!confirmDelete) {
    return props;
  }
  if (Array.isArray(toDelete)) {
    return filterArrFromArray(props, toDelete);
  } else return props.filter((item) => item !== toDelete);
};
