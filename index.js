
//import handlebars from 'handlebars';
// https://cdnjs.com/libraries/handlebars.js
//import handlebars from 'https://cdn.jsdelivr.net/npm/handlebars@4.7.8/dist/cjs/handlebars.min.js';
//import handlebars from './handlebars.js';
//import './node_modules/handlebars/dist/handlebars.js';
import { FetchHiveData, ExtractParams } from './api.js';

let fs, path, handlebars, isNode; //,

const BuildFilePath = (dir, filename) => {
  if (isNode) {
    return path.format({
      dir,
      base: filename
    });

  } else {
    if (!dir.endsWith('/')) {
      dir += '/';
    }
    return dir + filename;
  }
}

const ReadFileData = async (filepath) => {
  if (isNode) {
    return fs.readFileSync(filepath, 'utf-8');

  } else {
    const response = await fetch(filepath);
    return await response.text();
  }
}

const main = async () => {
  // Node.js or browser
  let argvs = null;
  isNode = typeof process !== 'undefined' && process.versions?.node;
  //console.log('isNode', isNode);

  if (isNode) {
    fs = await import('fs');
    path = await import('path');
    const hbs = await import('handlebars');
    handlebars = hbs.default
    if (process.argv[2]) argvs = process.argv.slice(2);

  } else {
    //const module = await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.8/dist/handlebars.min.js');
    const module = await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.8/+esm');
    //handlebars = hbsCDN.default || window.Handlebars;
    handlebars = module.default;
    const argsInput = document.getElementById('arguments');
    if (argsInput) {
      argvs = argsInput.value.trim()
        .split(/\s+/) // Split by whitespace
        .filter(arg => arg.length > 0); // Remove empty strings
    }
  }
  //process.exit(0);

  // Check if a filename is provided
  if (!argvs[0]) {
    console.error('Please provide the path to the JSON data file.');
    process.exit(1);
  }

  // Get the JSON file path from command-line arguments. Ex: npm start -- compilation_1.json
  const dataFilePath = BuildFilePath('./compilation_data', argvs[0]);

  // Load the Handlebars template
  const template = await ReadFileData('./templates/GodsOnChain.hbs');

  // Read the data from the provided JSON file
  let data;
  try {
    //data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
    data = JSON.parse(await ReadFileData(dataFilePath));
  } catch (error) {
    console.error('Error reading or parsing the JSON data file:\n', error.message);
    process.exit(1);
  }

  // Populate the JSON object with the rest of the necessary data
  for (const post of data.posts) {
    const params = ExtractParams(post.URL);
    //console.log(params);
    post.author = params.author; // add the author name to the JSON object

    const APIdata = await FetchHiveData('bridge.get_post', params);
    //console.dir(APIdata, { depth: null });
    //console.log(APIdata.result.title);
    //console.log(APIdata.result.json_metadata.image[0]);
    post.title = APIdata.result.title;
    post.coverImage = APIdata.result.json_metadata.image[0]; // The blog post's cover image appears to be the first in the array 
    };

  //console.log(data); // for debugging purposes

  // Compile the template with the complete JSON data
  const compiledTemplate = handlebars.compile(template);
  const outputMd = compiledTemplate(data);

  // Output the final result (or save it to a file)
  //console.log(outputMD);

  let mdFilename;
  if (isNode) {
    mdFilename = path.basename(dataFilePath, path.extname(dataFilePath)) + '.md';

  } else {
    const filename = dataFilePath.split('/').pop(); // Get the last part of the path
    const extIndex = filename.lastIndexOf('.');
    const baseName = extIndex !== -1 ? filename.slice(0, extIndex) : filename;
    mdFilename = baseName + '.md';
  }

  //console.log(mdFilename);
  //process.exit(0);

  const outputFile = BuildFilePath('./output_markdown', mdFilename)

  if (isNode) {
    fs.writeFileSync(outputFile, outputMd);

  } else {
    const blob = new Blob([outputMd], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = mdFilename;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);

    // Delay revoking the Blob URL to prevent early cleanup
    setTimeout(() => {
      //
    }, 5000); // 1 second should be enough for most cases
  }

  console.log(`Markdown file ${outputFile} created from template.`)
}
await main();