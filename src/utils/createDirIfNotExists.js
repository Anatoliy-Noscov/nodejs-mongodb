import fs from 'fs/promises';

export const createDirNotExists = async (url) => {
    try {
        await fs.access(url);

    } catch (err) {
        if(err.code === 'ENOENT') {
            await fs.mkdir(url);
        }
    }
}