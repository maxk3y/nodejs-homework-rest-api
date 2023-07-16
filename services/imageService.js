const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const uuid = require('uuid').v4;
const fse = require('fs-extra');

const AppError = require('../utils/appError');

class ImageService {
  static upload(name) {
    const tempDir = path.join(__dirname, '../', 'temp');

    const multerStorage = multer.diskStorage({
      destination: tempDir,
      filename: (req, file, cbk) => {
        cbk(null, file.originalname);
      },
    });

    const multerFilter = (req, file, cbk) => {
      if (file.mimetype.startsWith('image/')) {
        cbk(null, true);
      } else {
        cbk(new AppError(400, 'Please, upload images only!'), false);
      }
    };
    return multer({
      storage: multerStorage,
      fileFilter: multerFilter,
    }).single(name);
  }

  static async save(file, ...pathSegments) {
    const fileName = `${uuid()}.jpeg`;

    const fullFilePath = path.join(process.cwd(), 'public', ...pathSegments);

    await fse.ensureDir(fullFilePath);

    Jimp.read(file.path, (error, file) => {
      if (error) throw new AppError(400, 'Cannot read file');

      file.resize(250, 250).quality(90).write(path.join(fullFilePath, fileName));
    });
    return path.join(...pathSegments, fileName);
  }
}

module.exports = ImageService;
