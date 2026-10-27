import { createTask, getAllTasks, getTaskById, updateTask, updateTaskStatus, deleteTask } from "../repositories/taskRepository";

export async function testTaskRepository(){
    console.log('Starting task repository test...');

    const created = await createTask({
        title: 'Test PocketPlan task',
        description: 'Testing SQLite task storage',
        due_date: '2026-10-30',
        due_time: '14:30',
        priority: 'high',
        status: 'incomplete',
    });

    console.log('1. Created task:', created);
    console.log(created.id);

    const found = await getTaskById(created.id);

    console.log(found.id);

    if(!found || found.title !== 'Test PocketPlan task'){
        throw new Error('Could not retrieve the created task');
    }

    console.log('2. Retrieved trask:', found.title);

    const updated = await updateTask(created.id, {
        title: 'Updated PocketPlan task',
        description: 'Updated task description',
        due_date: '2026-10-31',
        due_time: '15:00',
        priority: 'medium',
        status: 'incomplete',
        category_id: null,
    });

    if(updated.title !== 'Updated PocketPlan task' || updated.priority !== 'medium'){
        throw new Error('Task update failed.');
    }

    console.log('3. Updated task:', updated.title);

    const statusUpdated = await updateTaskStatus(
        created.id,
        'complete'
    );

    if(statusUpdated.status !== 'complete'){
        throw new Error('Task status update failed.');
    }

    console.log('4. Updated task status:', statusUpdated.status);

    const tasks = await getAllTasks();

    if(!tasks.some((task) => task.id === created.id)){
        throw new Error('Created task was not found in the task list.');
    }

    console.log('5. Retrieved all tasks. Total:', tasks.length);

    await deleteTask(created.id);

    const deleted = await getTaskById(created.id);

    if(deleted !== null){
        throw new Error('Task was not deleted.');
    }

    console.log('6. Task deleted successfully.');

    let invalidTaskRejected = false;

    try{
        await createTask({title: '  '});
    } catch (error){
        invalidTaskRejected = true;
        console.log('7. Empty task title correctly rejected');
    }

    if(!invalidTaskRejected) {
        throw new Error('An empty task title was incorrectly accepted.');
    }

    console.log('Task repository test completed');
}