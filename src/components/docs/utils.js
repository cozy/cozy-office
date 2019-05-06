export const defaultTitle = doc => {
  const createdAt = doc && doc.cozyMetadata && doc.cozyMetadata.createdAt
  return createdAt
    ? `Document sans titre du ${new Date(createdAt).toLocaleString()}`
    : null
}

export const titleWithDefault = (doc, fallback = defaultTitle) => {
  return doc.title || (fallback instanceof Function ? fallback(doc) : fallback)
}

export default { defaultTitle, titleWithDefault }
