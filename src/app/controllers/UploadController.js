const cloudinary = require("../middlewares/upload")
const fs = require("fs")

class UploadController {
  async uploadImages(req, res) {
    try {
      const uploader = async (path) =>
        await cloudinary.uploads(path, "products")
      const urls = []
      const files = req.files
      for (const file of files) {
        const { path } = file
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }

      res.status(200).json({
        message: "Tải ảnh lên thành công",
        data: urls,
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new UploadController()
