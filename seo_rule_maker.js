const cheerio = require('cheerio');

const detectElemWithoutAttr = (html, rule) => {
  const { tag, attr } = rule;
  const $ = cheerio.load(html);
  const elements = $(tag);
  let counter = 0;
  if (attr.name) {
    elements.each((index, elem) => {
      const attribute = $(elem).attr(attr.name);
      if (!attribute) {
        counter += 1;
      }
    });
    if (counter > 0) {
      const message = `There are ${counter} ${tag} tag without ${attr.name} attribute.`;
      return message;
    }
  } else {
    throw new Error('Attribute is required for the rule.');
  }
};

const detectWithoutElem = (html, rule) => {
  const { tag } = rule;
  const $ = cheerio.load(html);
  const elements = $(tag);
  const message = `This HTML without ${tag} tag`;
  if (elements.length === 0) {
    return message;
  }
};

const detectElemAttrNotMatchValue = (html, rule) => {
  const { tag, attr } = rule;
  const $ = cheerio.load(html);
  const elements = $(tag);

  let counter = 0;
  elements.each((index, elem) => {
    const attrValue = $(elem).attr(attr.name);
    if (attrValue === attr.value) counter += 1;
  });
  const message = `This HTML without <${tag} ${attr.name}='${attr.value}'> tag`;
  if (counter === 0) {
    return message;
  }
};

const detectElemCount = (html, rule) => {
  const { tag, limit } = rule;
  const $ = cheerio.load(html);
  const elements = $(tag);
  if (limit.type === 'upper') {
    if (elements.length > limit.count) {
      const message = `This HTML has more than ${limit.count} <${tag}>`;
      return message;
    }
  } else if (limit.type === 'lower') {
    if (elements.length < limit.count) {
      const message = `This HTML has less than ${limit.count} <${tag}>`;
      return message;
    }
  }
};

const classifyRules = (html, rule) => {
  const { tag, attr, limit } = rule;
  if (!tag) throw new Error('Tag does not provided.');
  if (!attr && !limit) {
    return detectWithoutElem(html, rule);
  }
  if (!limit && attr && !attr.value) {
    return detectElemWithoutAttr(html, rule);
  }
  if (!limit && attr && attr.value) {
    return detectElemAttrNotMatchValue(html, rule);
  }
  if (!attr && limit) {
    return detectElemCount(html, rule);
  }
};

const makeSEORule = (html, allRules) => {
  if (!html) throw new Error('HTML does not existed.');
  const messages = allRules.map((rule) => classifyRules(html, rule));
  const output = messages.join('\n');
  return output.trim();
};

module.exports = {
  makeSEORule,
};
