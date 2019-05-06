import { titleWithDefault } from '../components/docs/utils'

const server = 'https://manage.poc-onlyoffice.cozycloud.cc'

let instancePromise

export async function getPublicName(client) {
  if (!instancePromise) {
    instancePromise = client
      .getStackClient()
      .fetchJSON('GET', '/settings/instance')
      .then(
        instance =>
          (instance &&
            instance.data &&
            instance.data.attributes &&
            instance.data.attributes.public_name) ||
          getInstance()
      )
  }
  return instancePromise
}

function getInstance() {
  return location.hostname.replace(/[-.].*/, '')
}

export async function getEditUrl(doc) {
  const instance = getInstance()
  const fileName = doc.fileName
  const backUrl = location.origin + '/#/'
  const userid = instance
  const name = await getPublicName()
  const title = titleWithDefault(doc) + '.' + doc.ext
  const lang = 'fr'
  return `${server}/editor?fileName=${encodeURIComponent(
    fileName
  )}&title=${encodeURIComponent(
    title
  )}&lang=${lang}&backUrl=${encodeURIComponent(
    backUrl
  )}&name=${encodeURIComponent(name)}&userid=${userid}`
}

export async function createDocument(id, ext) {
  const instance = getInstance()
  const url = `${server}/create?ext=${ext}&file=${id}&instance=${instance}`
  const response = await fetch(url, { method: 'POST', mode: 'cors' })
  if (!response.ok) {
    throw new Error("couldn't create a new document from server")
  }
  const data = await response.json()
  return data
}
