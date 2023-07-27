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

const checkImgWithoutAlt = async (html) => {
  const result = makeSEORule(html, {
    condition: 'elementWithoutAttr',
    elements: 'img',
    attr: 'alt',
  });
  return result;
};

const checkAWithoutRel = (html) => {
  const result = makeSEORule(html, {
    condition: 'elementWithoutAttr',
    elements: 'a',
    attr: 'rel',
  });
  return result;
};

const checkTitle = (html) => {
  const result = makeSEORule(html, {
    condition: 'withoutElement',
    elements: ['head', 'title'],
  });
  return result;
};

const checkMeta = (html, attr, value) => {
  const result = makeSEORule(html, {
    condition: 'elementAttrNotMatchValue',
    elements: ['meta'],
    attr,
    matchedValue: value,
  });
  return result;
};

const checkHead = (html) => {
  const titleCheck = checkTitle(html);
  const metaCheckDescription = checkMeta(html, 'name', 'description');
  const metaCheckKeywords = checkMeta(html, 'name', 'keywords');
  return [titleCheck, metaCheckDescription, metaCheckKeywords];
};

const checkStrong = (html, options = {}) => {
  const { times } = options;
  if (!times) {
    throw new Error("'times' is not provided.");
  }
  const result = makeSEORule(html, {
    condition: 'elemMoreThanX',
    elements: ['strong'],
    times,
  });
  return result;
};

const checkMoreThan1H1 = (html) => {
  const result = makeSEORule(html, {
    condition: 'elemMoreThanX',
    elements: ['h1'],
    times: 1,
  });
  return result;
};

const organizeOutput = (outputs) => {
  const flatOutputs = outputs.flat();
  let finalOutput = '';
  flatOutputs.map((output) => {
    if (output) {
      finalOutput += `${output}\n`;
    }
  });
  return finalOutput.trim();
};

const runRules = (html, fns, options = { additionals: [] }) => {
  try {
    const { additionals } = options;
    const outputs = fns.map((fn) => {
      const additionalFnResult = additionals.map((additional) => {
        if (additional.fn === fn) {
          return fn(html, additional);
        }
      });
      if (additionalFnResult[0]) {
        return additionalFnResult;
      }
      return fn(html);
    });
    const organizedOutput = organizeOutput(outputs);
    return organizedOutput;
  } catch (err) {
    console.error(err);
  }
};

const sendOutputs = (data, options = {}) => {
  try {
    const { outputType, outputPath } = options;
    if (outputType === 'stream') {
      return writeStream(data, outputPath);
    } if (outputType === 'file') {
      return writeFile(data, outputPath);
    }
    console.log(data);
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  readFromFile,
  readFromStream,
  makeSEORule,
  runRules,
  sendOutputs,
  checkImgWithoutAlt,
  checkAWithoutRel,
  checkHead,
  checkStrong,
  checkMoreThan1H1,
};
