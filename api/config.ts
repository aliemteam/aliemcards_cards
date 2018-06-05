import * as path from 'path';

export default {
  API_DIR: path.resolve(__dirname, './dist'),
  CARD_DIR: path.resolve(__dirname, '../cards'),
  IGNORED_FILES: ['.DS_Store', 'announcements.yml'],
  IMG_URL_PREFIX: 'https://aliemteam.github.io/aliemcards_cards/images',
  REGEX: {
    image_url: new RegExp(/[\w-]+\.(?:png|jpg|jpeg|gif)/, 'gi'),
    image_file: new RegExp(/\.(gif|jpg|jpeg|tiff|png)$/, 'i'),
    markdownH1: new RegExp(/^#(?!#).+/, 'm'),
    frontmatter: new RegExp(/(^-{3}(?:\r\n|\r|\n)([\w\W]*?)-{3}(?:\r\n|\r|\n))?([\w\W]*)*/),
    hasReferenceHeading: new RegExp(/## References/),
    imagesWithoutAltText: new RegExp(/\!\[\]\(image-\d{1,2}\.\w+\)/, 'gi'),
    dateStringFormat: new RegExp(/^\d{4}\/\d{2}\/\d{2}$/),
  },
}