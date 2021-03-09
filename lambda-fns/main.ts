import createEasterEgg from './createEasterEgg';
import deleteEasterEgg from './deleteEasterEgg';
import getEasterEggById from './getEasterEggById';
import listEasterEggs from './listEasterEggs';
import updateEasterEgg from './updateEasterEgg';
import EasterEgg from './EasterEgg';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     easterEggId: string,
     authorId: string,
     easterEgg: EasterEgg
  }
}

exports.handler = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getEasterEggById":
            return await getEasterEggById(event.arguments.easterEggId, event.arguments.authorId);
        case "createEasterEgg":
            return await createEasterEgg(event.arguments.easterEgg);
        case "listEasterEggs":
            return await listEasterEggs(event.arguments.authorId);
        case "deleteEasterEgg":
            return await deleteEasterEgg(event.arguments.easterEggId, event.arguments.authorId);
        case "updateEasterEgg":
            return await updateEasterEgg(event.arguments.easterEgg);
        default:
            return null;
    }
}