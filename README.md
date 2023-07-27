# SEO_checker
This module is a tool for examining SEO by scanning several rules on html. 

## Example
```
// Reading data from file
readFromFile('test.html')

// Reading data from stream
readFromStream(stream_data)

// Making SEO check rules
makeSEORule(html, {
    condition: 'withoutElement',
    elements: ['head', 'title'],
})

// Run and combine the check rules. The additionals setting is for rule with occurrence limitation.
const output = runRules(
    html,
    [checkHead, checkStrong],
    { additionals: [{ fn: checkStrong, times: 2 }] },
)

// Send the output by specific way. The default mode is console.
sendOutputs(output, { outputType: 'stream', outputPath: 'outputs.txt' });
```