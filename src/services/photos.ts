import {Photo} from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 as createId } from 'uuid';

export const getAll = async () => {
    let list: Photo[] = [];

    const portfolioFolder = ref(storage, "portfolio");
    const photoList = await listAll(portfolioFolder);

    for(let i in photoList.items){
        let photoUrl = await getDownloadURL(photoList.items[i]);
        list.push({
            name:photoList.items[i].name,
            url: photoUrl
        });
    }

    return list;
}

export const insert = async (file: File) => {
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)){
        let randomName = createId();
        let newFile = ref(storage, `portfolio/${randomName}`);
        let upload = await uploadBytes(newFile, file);
        let photourl = await getDownloadURL(upload.ref);

        return {
            name: upload.ref.name,
            url: photourl
        } as Photo;
    } else {
        return new Error('Tipo de arquivo não permitido.');
    }
}