# SEO_checker
This module is a tool for examining SEO by scanning several rules on html. 

## Default Usage
```
const { checkSEO } = require('seo_checker');

checkSEO({ 
    inputType: 'file', 
    output: 'test.txt' 
    }, 
    'test.html'
);
```

## Custom Options
```
checkSEO({
  inputType: 'file',
  output: 'test.txt', // result output path
  print: true, // default: true

  // default rules
  default: {
    img: true, // default: true
    a: true, // default: true
    title: true, // default: true
    descriptions: false, // default: true
    keywords: true, // default: true
    strong: 2, // default: 15
    h1: 2, // default: 1
  },

  // Customize rules
  rules: [
    // tag is exist or not
    { tag: 'video' },

    // tag is more than specific count
    { tag: 'h2', limit: { type: 'upper', count: 2 } },

    // attribute value of tag is exist or not
    { tag: 'meta', attr: { name: 'property', value: 'og:url' } },
    { tag: 'meta', attr: { name: 'name', value: 'robots' } },
  ],
},
"test.html"
)
```
## Node Stream Usage
```
checkSEO({ 
    inputType: 'stream', 
    output: 'test.txt' 
    }, 
    stream_data
);
```