export async function createClassFromModule(file, name) {
    const module = await import(file);
    return new module[name]();
}