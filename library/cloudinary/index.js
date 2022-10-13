const logger = require('winston');
const config = require('../../config');
const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.secret_key
});

exports.uploadImage = (stremImage, folder_path) => {
    return new Promise((resolve, reject) => {
        try {
            return cloudinary.uploader.upload_stream({ resource_type: 'image', folder: folder_path }, (error, result) => {
                if (error) {
                    reject(new Error("Couldn't upload"));
                }
                console.log(result)
                resolve(result.secure_url);
            }).end(stremImage);
        } catch (err) {
            console.log(err)
            reject(InternalError(err));
        }
    });
}

exports.DeleteImage = (stremImage) => {
    return new Promise((resolve, reject) => {
        try {
            return cloudinary.uploader.destroy(stremImage, (error, result) => {
                if (error) {
                    reject(new Error("Couldn't upload"));
                }
                resolve(result);
            });
        } catch (err) {
            console.log(err)
            reject(InternalError(err));
        }
    });
}

exports.UpdateImage = (stremImage, folder_path,public_id) => {
    return new Promise((resolve, reject) => {
        try {
            return cloudinary.uploader.upload_stream({ resource_type: 'image',public_id: public_id , overwrite: true}, (error, result) => {
                if (error) {
                    reject(new Error("Couldn't upload"));
                }
                resolve(result.secure_url);
                console.log(result)
            }).end(stremImage);
        } catch (err) {
            console.log(err)
            reject(InternalError(err));
        }
    });
}