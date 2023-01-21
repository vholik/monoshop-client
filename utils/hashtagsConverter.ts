export const convertStringToHashtags = (val: string) => {
  const hashtags = val.split(" ");

  return hashtags.map((hashtag) => hashtag.slice(1, -1));
};
