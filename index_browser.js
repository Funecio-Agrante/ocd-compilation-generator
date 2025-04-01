
import { FetchHiveData, ExtractParams } from './api.js';

const BuildFilePath = (dir, filename) => {
  if (!dir.endsWith('/')) {
    dir += '/';
  }
  return dir + filename;
}

const ReadFileData = async (filepath) => {
  const response = await fetch(filepath);
  return await response.text();
}

const Main = async () => {
  let argvs = null;

  const module = await import('https://cdn.jsdelivr.net/npm/handlebars@4.7.8/+esm');
  const handlebars = module.default;

  const argsInput = document.getElementById('arguments');
  if (argsInput) {
    argvs = argsInput.value.trim()
      .split(/\s+/) // Split by whitespace
      .filter(arg => arg.length > 0); // Remove empty strings
  }

  // Check if a filename is provided
  if (!argvs[0]) {
    console.error('Please provide the path to the JSON data file.');
    return;
  }

  // Get the JSON file path from passed on arguments. Ex: compilation_1.json
  const dataFilePath = BuildFilePath('./compilation_data', argvs[0]);

  // Load the Handlebars template
  const template = await ReadFileData('./templates/GodsOnChain.hbs');

  // Read the data from the provided JSON file
  let data;
  try {
    data = JSON.parse(await ReadFileData(dataFilePath));
  } catch (error) {
    console.error('Error reading or parsing the JSON data file:\n', error.message);
    process.exit(1);
  }

  // Populate the JSON object with the rest of the necessary data
  for (const post of data.posts) {
    const params = ExtractParams(post.URL);
    post.author = params.author; // add the author name to the JSON object

    const APIdata = await FetchHiveData('bridge.get_post', params);
  
    post.title = APIdata.result.title;
    post.coverImage = APIdata.result.json_metadata.image[0]; // The blog post's cover image appears to be the first in the array 
  };

  //console.log(data); // for debugging purposes

  // Compile the template with the complete JSON data
  const compiledTemplate = handlebars.compile(template);
  const outputMd = compiledTemplate(data);

  // Output the final result (or save it to a file)
  //console.log(outputMD);

  const filename = dataFilePath.split('/').pop(); // Get the last part of the path
  const extIndex = filename.lastIndexOf('.');
  const baseName = extIndex !== -1 ? filename.slice(0, extIndex) : filename;
  const mdFilename = baseName + '.md';
  //console.log(mdFilename);

  const blob = new Blob([outputMd], { type: 'text/plain' });
  const link = document.createElement('a');
  link.download = mdFilename;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);

  console.log(`Markdown file ${mdFilename} created from template.`)
}
await Main();