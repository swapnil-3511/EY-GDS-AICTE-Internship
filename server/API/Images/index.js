import express from 'express';
import multer from 'multer';
import { s3Upload } from '../../utils/AWS/s3';
import { ImageModel } from '../../database/allModels';

const Router = express.Router();

//+ Muler configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

/*
   Router    /
   Des       get image
   Params    _id
   Access    Public
   Method    POST
 */

Router.get('/:_id', async (req, res) => {
  try {
    const image = await ImageModel.findById(req.params._id);

    return res.json({ image });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
/*
   Router    /
   Des       upload an image to s3 bucket, then saveing the file to mongodb
   Params    none
   Access    Public
   Method    POST
 */

Router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    console.log(file);
    //* s3 bucket options
    const bucketOptions = {
      Bucket: 'zomato-clone-project-bucket',
      Key: file.originalname,
      Body: file.buffer,
      Contenttype: file.mimetype,
      ACL: 'public-read', // Access Control List
    };

    const uploadImage = await s3Upload(bucketOptions);
    return res.status(200).json({ uploadImage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default Router;
