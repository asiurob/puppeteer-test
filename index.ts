import { DoListGenerator } from "./do-list-generator";
import { DoListPage } from './do-list-page';

( async () => {
    const taskGenUrl = 'https://randomtodolistgenerator.herokuapp.com/library';
    const taskUrl    = 'https://todoist.com/users/showlogin';

    
    /**GET TASKS */
    const dolist = new DoListGenerator( taskGenUrl );
    await dolist.initialize();
    const tasks = await dolist.getTasks();
    console.log( tasks );
    await dolist.stop();


    /**LOGIN AND ADD TASKS */
    const saveList = new DoListPage( taskUrl, false );
    await saveList.initialize();
    await saveList.login();
    await saveList.setTasks( tasks, 0 );

})();



