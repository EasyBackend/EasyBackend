import inquirer from 'inquirer'
import { DatabaseStorageType } from '../../../../../../../types'
import { RestProjectTracker, GqlProjectTracker } from '../../../../../../../utils'
import { databaseSchemaQuestions } from '../database-schema-questions'

export const chooseUniqueProp = async (tracker: RestProjectTracker | GqlProjectTracker): Promise<string | void> => {
  const { uniqueProp } = await inquirer.prompt([databaseSchemaQuestions.uniqueProp])

  if (uniqueProp) {
    const typeProps = tracker.getFromStorage(DatabaseStorageType.schemaProps)

    const { chosenUniqueProperty }: { chosenUniqueProperty: string } = await inquirer.prompt([
      databaseSchemaQuestions.chooseUniqueProp(typeProps),
    ])

    if (chosenUniqueProperty && chosenUniqueProperty !== '--cancel') {
      tracker.addToStorage({
        key: DatabaseStorageType.uniqueProperty,
        value: chosenUniqueProperty,
      })
    }
  }
}
