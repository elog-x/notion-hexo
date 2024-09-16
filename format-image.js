
const { matterMarkdownAdapter } = require('@elog/cli')
const elogConfig = require('./elog.config')

/**
 * 自定义文档处理器
 * @param {DocDetail} doc doc的类型定义为 DocDetail
 * @param {any} imageClient 图床下载器
 * @return {Promise<DocDetail>} 返回处理后的文档对象
 */
const format = async (doc, imageClient) => {
  doc.body = matterMarkdownAdapter(doc);
  // 配置中无cover
  if (!elogConfig.deploy.local.frontMatter.include.includes('cover')) {
    return doc
  }
  // cover字段实际为空
  if (!doc.properties.cover) {
    return doc;
  }
  const cover = doc.properties.cover
  // 将 cover 字段中的 notion 图片下载到本地
  if (imageClient)  {
    // 只有启用图床平台image.enable=true时，imageClient才能用，否则请自行实现图片上传
    const url = await imageClient.uploadImageFromUrl(cover, doc)
    // cover链接替换为本地图片
    doc.properties.cover = url
  }
  return doc;
};

module.exports = {
  format,
};
