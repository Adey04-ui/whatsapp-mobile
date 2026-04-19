import instance from '../app/axios.js'

export const sendMessage = async ({chatId, content, recipient}) => {
  const { data } = await instance.post(`/messages`, {content, chatId, recipient})
  return data
}