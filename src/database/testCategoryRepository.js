import { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } from "../repositories/categoryRepository";

export async function testCategoryRepository() {
    console.log('Starting category repository test...');

    const created = await createCategory('Test School');

    console.log('1. Created:', created);

    const found = await getCategoryById(created.id);

    if(!found || found.name !== 'Test School'){
        throw new Error('Could not retrieve the created category.');
    }

    console.log('2. Retrieved category:', found.name);

    const updated = await updateCategory(created.id, 'Test Updated');

    if(updated.name !== 'Test Updated'){
        throw new Error('Category update failed.');
    }

    console.log('3. Updated category', updated.name);

    const categories = await getAllCategories();

    console.log('4. Total categories:', categories.length);

    await deleteCategory(created.id);

    const deleted = await getCategoryById(created.id);

    if(deleted !== null){
        throw new Error('Category was not deleted.');
    }

    console.log('5. Category deleted successfully.');
    console.log('Category repository test completed!');
}