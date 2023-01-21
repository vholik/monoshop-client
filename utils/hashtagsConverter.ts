export const convertStringToHashtags = (val: string) => {
  if (!val) {
    return []
  }

  const hashtags = val.split(' ')

  return hashtags.map((hashtag) => hashtag.slice(1))
}

export const convertHashtagsToString = (val: string[]) => {
  if (!val) {
    return ''
  }

  return val.map((hashtag) => `#${hashtag}`).join(' ')
}
