import * as fs from 'fs';
import * as path from 'path';

import config from './config';
import { extract_frontmatter } from './utils';

interface FilePaths {
  base: string,
  path: string
}

function checkCardsDirShape(d: FilePaths[]): void {
  d.forEach(dir => {
    // check top level directories
    if(!fs.statSync(dir.path).isDirectory()) {
      throw Error('No files should be located in the first level of the "cards" directory.');
    }
    // check for card.md file
    if(fs.readdirSync(dir.path).indexOf('card.md') === -1) {
      throw Error(`No "card.md" file found in directory: ${dir}`);
    }
  });
}

function checkFrontmatter(dir: string) {
  const keys = ['authors', 'categories', 'created', 'title', 'updates'];
  const contents = fs.readFileSync(`${dir}/card.md`, 'utf8');
  const { body, ...fm } = extract_frontmatter(contents);
  const attributeKeys = Object.keys(fm);

  if (attributeKeys.length < keys.length) {
    throw Error(`${dir} is missing yaml attributes`);
  }

  ['authors', 'categories'].forEach(arr => {
    if (!Array.isArray(fm[arr])) {
      throw Error (`Invalid "${arr}" in yaml of ${dir}`);
    }
    if (fm[arr].length === 0) {
      throw Error (`No "${arr}" listed in yaml of ${dir}`);
    }
  });

  if (
    typeof fm.created !== 'string' ||
    fm.created === '' ||
    !config.REGEX.dateStringFormat.test(fm.created)
  ) {
    throw Error(`Invalid "created" property in yaml of ${dir}`);
  }

  if (
    typeof fm.title !== 'string' || fm.title === ''
  ) {
    throw Error(`Invalid "title" property in yaml of ${dir}`);
  }

  if (fm.updates !== null && !Array.isArray(fm.updates)) {
    throw Error(`Invalid "updates" property in yaml of ${dir}`);
  }
}

function checkYAML(dir: string) {
  const contents = fs.readFileSync(`${dir}/card.md`, 'utf8');
  const { body, ...frontmatter } = extract_frontmatter(contents);
  // Does frontmatter exist?
  if (Object.keys(frontmatter).length === 0) {
    throw Error(`Frontmatter not found for ${dir}`);
  }
  // Does the card have an H1 title?
  if (!config.REGEX.markdownH1.test(body)) {
    throw Error(`H1 title not set for ${dir}`);
  }
  // Does the card have a reference header?
  if (!config.REGEX.hasReferenceHeading.test(body)) {
    throw Error(`Improper reference format found in ${dir}`);
  }
  // Are their images w/o alt text?
  if (config.REGEX.imagesWithoutAltText.test(body)) {
    console.warn(
      `\x1b[33m\x1b[1mWarning:\x1b[0m One or more images in \x1b[32m${dir}\x1b[0m do not have alt text`,
    );
  }
}

// read cards dir, filter out ignored files
const cards_dir = fs.readdirSync(config.CARD_DIR)
  .filter(x => config.IGNORED_FILES.indexOf(x) === -1)
  .map(x => ({ base: x, path: `${config.CARD_DIR}/${x}` }));

checkCardsDirShape(cards_dir);
cards_dir.forEach(dir => {
  checkYAML(dir.path);
  checkFrontmatter(dir.path);
});
