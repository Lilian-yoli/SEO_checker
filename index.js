const fs = require('fs');
const cheerio = require('cheerio');
const { makeSEORule } = require('./seo_rule_maker');

const readFromFile = (path) => new Promise((resolve, reject) => {
  if (path) {
    const pathInfo = path.split('.');
    const pathInfoLength = pathInfo.length;
    const extension = pathInfo[pathInfoLength - 1];
    if (extension === 'html') {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    } else {
      reject(new Error('Invalid file extension.'));
    }
  }
});

const writeFile = (data, path) => {
  fs.writeFile(path, data, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Write operation complete.');
    }
  });
};

const readFromStream = (stream) => new Promise((resolve, reject) => {
  let inputdata = '';
  stream.setEncoding('UTF8');
  stream.on('data', (chunk) => {
    inputdata += chunk;
  });
  stream.on('end', () => {
    resolve(inputdata);
  });
  stream.on('error', (err) => {
    reject(err);
  });
});

const writeStream = (data, path) => {
  const writerStream = fs.createWriteStream(path);
  writerStream.write(data, 'UTF8');
  writerStream.end();
  writerStream.on('finish', () => {
    console.log('Stream writing is completed.');
  });
  writerStream.on('error', (err) => {
    console.error(err);
  });
};

const defaultRules = {
  img: { tag: 'img', attr: { name: 'alt' } },
  a: { tag: 'a', attr: { name: 'rel' } },
  title: { tag: 'title' },
  descriptions: { tag: 'meta', attr: { name: 'name', value: 'descriptions' } },
  keywords: { tag: 'meta', attr: { name: 'name', value: 'keywords' } },
  strong: { tag: 'strong', limit: { type: 'upper', count: 15 } },
  h1: { tag: 'h1', limit: { type: 'upper', count: 1 } },
};

const checkSEO = async (options, data) => {
  if (!options) console.log("'options' is required for seo_checker.");
  const predefinedRules = options.default;
  const { rules } = options;
  const allRules = [];

  if (predefinedRules) {
    Object.keys(predefinedRules).map((key) => {
      if (typeof predefinedRules[key] === 'number') {
        defaultRules[key].limit.count = predefinedRules[key];
        rules.push(defaultRules[key]);
      } else if (predefinedRules[key]) {
        rules.push(defaultRules[key]);
      }
    });
  }

  if (Array.isArray(rules)) {
    rules.map((rule) => {
      allRules.push(rule);
    });
  }

  if (options.inputType && options.inputType === 'file') {
    const html = await readFromFile(data);
    const result = makeSEORule(html, allRules);
    if (options.print) console.log(result);
    writeFile(result, options.output);
  } else if (options.inputType && options.inputType === 'stream') {
    const html = await readFromStream(data);
    const result = makeSEORule(html, allRules);
    if (options.print) console.log(result);
    writeStream(result, options.output);
  } else if (!options.inputType) {
    console.error(new Error('"inputType" is missing.'));
  } else {
    console.error(new Error('Invalid inputType.'));
  }
};

module.exports = {
  checkSEO,
};
