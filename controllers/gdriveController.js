const { v4: uuidv4 } = require('uuid');
const drive = require('../services/googleDrive');
const Image = require('../models/Image');
const { Readable } = require('stream');

const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.body.user_id;

    const fileName = `${uuidv4()}.${file.originalname.split('.').pop()}`;
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER],
    };

    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    };

    const uploadedFile = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: 'id',
    });

    await drive.permissions.create({
      fileId: uploadedFile.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const image = await Image.create({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      google_drive_id: uploadedFile.data.id,
      user_id: userId,
      url: `https://drive.google.com/uc?export=view&id=${uploadedFile.data.id}`,
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      image,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const image = await Image.findByPk(req.params.id);
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await drive.files.delete({ fileId: image.google_drive_id });
    await image.destroy();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bulkDeleteFiles = async (req, res) => {
  try {
    const ids = req.body.ids;
    const images = await Image.findAll({ where: { id: ids } });

    const results = await Promise.allSettled(
      images.map(async (image) => {
        try {
          await drive.files.delete({ fileId: image.google_drive_id });
          await image.destroy();
          return { id: image.id, status: 'deleted' };
        } catch (error) {
          return { id: image.id, status: 'error', error: error.message };
        }
      })
    );

    const deleted = results.filter((r) => r.value.status === 'deleted').map((r) => r.value.id);
    const errors = results
      .filter((r) => r.value.status === 'error')
      .map((r) => ({
        id: r.value.id,
        error: r.value.error,
      }));

    res.json({
      message: 'Bulk delete completed',
      deleted,
      errors,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
  deleteFile,
  bulkDeleteFiles,
};
