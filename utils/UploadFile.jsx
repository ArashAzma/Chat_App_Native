import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { fireStorage } from "../config/firebase.config";
export default uploadImageToDB = async (image) => {
    const response = await fetch(image);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const metadata = {
            contentType: "image/jpeg",
        };
        const storageRef = ref(fireStorage, "images/" + image);
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

        console.log("START UPLOADING");
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                }
            },
            (error) => {
                console.log(error);
                reject(error);
            },

            async () => {
                try {
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                    );
                    console.log("File available at", downloadURL);
                    resolve(downloadURL);
                } catch (error) {
                    console.error("Error getting download URL:", error);
                    reject(error);
                }
            }
        );
    });
};
