# OCD Compilation Post Generator

A Node.js tool that generates compilation posts from a [Handlebars](https://handlebarsjs.com/guide/#what-is-handlebars) template, retrieving the data from user-edited JSON files and the Hive API.

This tool aims to automate the tedious and error-prone process of manual copy-pasting and editing new compilation posts from previous ones. This allows the Curator to focus on the more human-centric tasks of selecting posts worthy of promotion and crafting a summary for each.

OCD - [Original Content Decentralized](https://peakd.com/c/hive-174578/created) is a curation project on the [Hive blockchain](https://hive.io/) focusing on curating and rewarding original content.

## Features

- Dynamically inserts content into a template using Handlebars
- Fetches the selected blog posts data from the Hive API
- Can preserve past JSON input files as well as the output markdown files

## Installation

There are two approaches: run with Node.js (original way) OR run in any Internet browser (Chrome, Firefox, Edge, etc.), which natively runs JavaScript. Both ways require software installation.

### Node.js

1. [Download](https://nodejs.org/en/download) and install Node.js (tested with v22.2.0) 

2. Clone the repository, either downloading from this page or using a command in terminal, ex.:

   ```
   gh repo clone Funecio-Agrante/ocd-compilation-generator
   ```
3. In a terminal window, navigate to the project's root folder, ex.:

    `cd ocd-compilation-post-generator`

4. Install dependencies: 

    `npm install`

5. Customize your Handlebars / Mustache template in `/templates` using a simple text editor or a source code editor. You can check the existing examples to adapt them to your needs. 

    5.1 Edit `index.js` to point to your new template file (line 19):
    
    `const template = fs.readFileSync('./templates/example-template.hbs', 'utf-8')`
    
    You should only need to do this once if you curate just one Community and you don't need to point to a different template after the initial setup.

### Browser

1. Install Python (if you don't have it already installed).

2. Clone the repository, either downloading from this page or using a command in terminal, ex.:

   ```
   gh repo clone Funecio-Agrante/ocd-compilation-generator
   ```
3. Customize your Handlebars / Mustache template in `/templates` using a simple text editor or a source code editor. You can check the existing examples to adapt them to your needs. 

    3.1 Edit `index.js` to point to your new template file (line 19):
    
    `const template = fs.readFileSync('./templates/example-template.hbs', 'utf-8')`
    
    You should only need to do this once if you curate just one Community and you don't need to point to a different template after the initial setup.


**I will help any OCD Curator to set up this tool and prepare a template file to match their current compilation post layout. Contact me preferably via OCD Discord.**

## Usage

### Node.js

1. Create a new JSON file in `/compilation_data` by copying one of the existing files. Edit the new file with the links and any other data required for your new compilation post. The idea is to save each compilation seed data as a separate JSON file, rather than overwriting the same file, allowing you to easily revisit and review past work when needed.

    You can use an [online JSON editor](https://jsoneditoronline.org/) to make the process easier and avoid syntax errors like missing commas, curly braces, double quotes, etc.

2. Create the markdown document for the new compilation post by opening a new terminal window in the root folder of the project and executing 

    `npm start -- <your_data_file>.json` <br>

    A `.md` file with the same name as the JSON document will be created (or overwritten if it already exists) in `/output_markdown`.

   2.1. If you don't want to create the markdown files, you can easily modify `index.js` to display the markdown in the terminal for direct copy / paste instead.

### Browser

1. Same as 1. for Node.js

2. In a terminal window, navigate to the project's root folder, ex.:

    `cd ocd-compilation-post-generator`

3. Start Python's HTTP server (any other server will do): 

    `python3 -m http.server`

4. Open a new browser tab and navigate to `http://localhost:8000/index.html`

5. Choose `index_browser.js` or `index.js`. The former works with browser only while the latter works with both.

6. In the arguments field input the name of the JSON file you created in step 1.

7. Press the button 'Run Script'. After a brief moment, the browser will ask you to download the markdown file ready for publishing.

   7.1 If you don't want to download the markdown file, you can easily modify the .js file to display the markdown in the webpage for direct copy / paste instead.

## License

This tool is licensed under the [CC BY 4.0](LICENSE).

You are free to use, modify, and distribute this project as long as you include proper attribution. See the [LICENSE](LICENSE) file for details.
