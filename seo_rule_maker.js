const cheerio = require('cheerio');

const chainElement = (elements) => {
  if (elements) {
    const newElement = elements.reduce((acc, element) => {
      acc = `${acc + element} `;
      return acc;
    }, '');
    return newElement.trim();
  }
};

const detectElemWithoutAttr = ($, HTMLelements, element, attr) => {
  let counter = 0;
  if (attr) {
    HTMLelements.each((index, elem) => {
      const attribute = $(elem).attr(attr);
      if (!attribute) {
        counter += 1;
      }
    });
    if (counter > 0) {
      const message = `There are ${counter} ${element} tag without ${attr} attribute.`;
      return message;
    }
  } else {
    throw new Error("'attr' is not provided.");
  }
};

const detectWithoutElem = (HTMLelements, element) => {
  const message = `This HTML without ${element} tag`;
  if (HTMLelements.length === 0) {
    return message;
  }
};

const detectElemAttrNotMatchValue = ($, HTMLelements, element, attr, matchedValue) => {
  if (!attr || !matchedValue) {
    throw new Error('Some essential data is missing from parameter.');
  }
  let counter = 0;
  HTMLelements.each((index, elem) => {
    const attrValue = $(elem).attr(attr);
    if (attrValue === matchedValue) counter += 1;
  });
  const message = `This HTML without <${element} ${attr}='${matchedValue}'> tag`;
  if (counter === 0) {
    return message;
  }
};

const detectElemMoreThanX = (HTMLelements, element, times) => {
  if (!times) {
    throw new Error("'times' is not provided.");
  }
  if (HTMLelements.length > times) {
    const message = `This HTML has more than ${times} <${element}>`;
    return message;
  }
};

const processByCondition = ($, HTMLelements, element, condition, attr, matchedValue, times) => {
  switch (condition) {
    case 'elementWithoutAttr':
      return detectElemWithoutAttr($, HTMLelements, element, attr);
    case 'withoutElement':
      return detectWithoutElem(HTMLelements, element);
    case 'elementAttrNotMatchValue':
      return detectElemAttrNotMatchValue($, HTMLelements, element, attr, matchedValue);
    case 'elemMoreThanX':
      return detectElemMoreThanX(HTMLelements, element, times);
    default:
      throw new Error('The condition is not existed.');
  }
};

const makeSEORule = (html, {
  condition, elements, attr, matchedValue, times,
}) => {
  const $ = cheerio.load(html);
  const chainedElements = chainElement(elements);
  if (!chainedElements) return new Error('Elements are not existed.');
  const HTMLelements = $(chainedElements);
  const result = processByCondition(
    $,
    HTMLelements,
    chainedElements,
    condition,
    attr,
    matchedValue,
    times,
  );
  return result;
};

module.exports = {
  makeSEORule,
};
