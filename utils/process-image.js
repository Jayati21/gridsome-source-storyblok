const path = require('path')
const https = require('https')
const fs = require('fs')
const { PLUGIN_ROOT, SOURCE_ROOT } = require('./constants')

/**
 * @method isStoryblokImage
 * @param  {String} value
 * @return {Boolean}
 */
const isStoryblokImage = value => value.indexOf('//a.storyblok.com/f/') !== -1

/**
 * @method downloadImage
 * @param  {String} url
 * @param  {String} filePath
 * @param  {String} filename
 * @return {Promise}
 */
const downloadImage = (url, filePath, filename) => {
  if (fs.existsSync(filePath)) {
    console.log(`Image ${filename} already downloaded`)
    return
  }

  const URL = `https:${url}`
  return new Promise((resolve) => {
    console.log(`Downloading: ${URL}...`)
    const file = fs.createWriteStream(filePath)

    https.get(URL, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        console.log('Download finished!')
        file.close(resolve)
      })
    }).on('error', (err) => {
      console.error(err.message)
      fs.unlink(resolve)
    })
  })
}

/**
 * @method getPathToSave
 * @param  {String} dir
 * @param  {String} filename
 * @return {String}          returns a absolute path to file that will be save
 */
const getPathToSave = (dir, filename) => {
  return path.join(PLUGIN_ROOT, SOURCE_ROOT, dir, filename)
}

/**
 * @method getFilename
 * @param  {String} url
 * @return {String}
 */
const getFilename = url => url.substring(url.lastIndexOf('/') + 1)

/**
 * @method getOptionsFromImage
 * @param  {String} imageDirectory
 * @param  {String} imageURL       Storyblok image URL
 * @return {Object}                { url, filePath, path, filename }
 */
const getOptionsFromImage = (imageDirectory, imageURL) => {
  const url = imageURL
  const filename = getFilename(imageURL)
  const filePath = getPathToSave(imageDirectory, filename)
  const path = `${imageDirectory}/${filename}`

  return {
    url,
    filePath,
    path,
    filename
  }
}

const processItem = imageDirectory => async item => {
  for (const key in item) {
    const value = item[key]
    if (value.constructor === String) {
      if (isStoryblokImage(value)) {
        try {
          const image = value
          const data = getOptionsFromImage(imageDirectory, image)
          const { url, filePath, path, filename } = data
          item[key] = {
            url,
            filename,
            path
          }
          await downloadImage(url, filePath, filename)
        } catch (e) {
          Promise.reject(e)
        }
      }
    }

    if (value.constructor === Array) {
      value.forEach(_item => {
        processItem(imageDirectory)(_item)
      })
    }

    if (value.constructor === Object) {
      for (const _key in value) {
        processItem(imageDirectory)(value[_key])
      }
    }
  }
}

/**
 * @method processImage
 * @param  {Object} options { imageDirectory: String }
 * @param  {Object} story   Storyblok story content
 * @return {Promise}
 */
const processImage = (options, story) => {
  return new Promise((resolve, reject) => {
    const imageDirectory = options.imageDirectory
    const body = story.content.body || []

    body.forEach(async item => {
      try {
        processItem(imageDirectory)(item)
      } catch (e) {
        reject(e)
      }
    })

    resolve(true)
  })
}

module.exports = processImage
