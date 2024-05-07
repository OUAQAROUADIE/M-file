import {ref, listAll, getDownloadURL, getStorage} from "firebase/storage";
import { collection, getFirestore } from "firebase/firestore";

export const getFilesForUser = async (userId, setFiles) => {
    const storage = getStorage();
    const storageRef = ref(storage, `files/${userId}`);
    const filesList = await listAll(storageRef);
    const urlsPromises = filesList.items.map(itemRef => getDownloadURL(itemRef));

    Promise.all(urlsPromises)
        .then(urls => {
            const filesData = filesList.items.map((itemRef, index) => ({
                id: itemRef.name,
                data: {
                    filename: itemRef.name,
                    fileURL: urls[index],
                    size: itemRef.size,
                    timestamp: itemRef.timeCreated
                }
            }));
            setFiles(filesData);
        })
        .catch(error => {
            console.error("Error fetching download URLs:", error);
        });
};
