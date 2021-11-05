import inquirer from "inquirer";
import { ICustomTypeProp } from "../../types";

export const deleteFromListCLI = async (props: string[]) => {
  const filterArrFromArray = (original: string[], toFilter: string[]) => {
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
export const deleteDuplicateValues = async (props: ICustomTypeProp[]) => {
  console.log("PROPS: ", props)
  const filterArrFromArray = (
    original: ICustomTypeProp[],
    toFilter: ICustomTypeProp[]
  ) => {
    original.forEach((prop, index) => {
      if (toFilter.includes(prop)) {
        original.splice(index, 1);
      }
    });
    return original;
  };
  // TODO: BUG: here the choices (props) are all undefined.
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
