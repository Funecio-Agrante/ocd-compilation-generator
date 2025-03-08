import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { FetchHiveData, ExtractParams } from './api.js';

// Check if a filename is provided
if (!process.argv[2]) {
  console.error('Please provide the path to the JSON data file.');
  process.exit(1);
}

// Get the JSON file path from command-line arguments. Ex: npm start -- compilation_1.json
const dataFilePath = path.format({
  dir: './compilation_data',
  base: process.argv[2] // The first argument should be the JSON file path
});

// Load the Handlebars template
const template = fs.readFileSync('./templates/example-template.hbs', 'utf-8');

// Read the data from the provided JSON file
let data;
try {
  data = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
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
const outputMD = compiledTemplate(data);

// Output the final result (or save it to a file)
//console.log(outputMD);
const outputFile = path.format({
  dir: './output_markdown',
  base: path.basename(dataFilePath, path.extname(dataFilePath)) + '.md'
});
fs.writeFileSync(outputFile, outputMD);
