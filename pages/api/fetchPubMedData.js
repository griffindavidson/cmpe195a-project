import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// The API route will trigger the Python script and then serve the resulting JSON.
export default function handler(req, res) {
  const scriptPath = path.resolve(process.cwd(), './PubMedArticleModule.py'); // Adjust path to your Python script
  const outputFilePath = path.resolve(process.cwd(), 'List_Of_PubMed_Articles.json');

  // Execute the Python script using the `exec` function from `child_process`
  exec(`python3 ${scriptPath}`, (err, stdout, stderr) => {
    if (err) {
      console.error('Error executing Python script:', err);
      return res.status(500).json({ error: 'Failed to execute Python script' });
    }

    if (stderr) {
      console.error('stderr:', stderr);
      return res.status(500).json({ error: 'Python script error' });
    }

    console.log('Python script output:', stdout);

    // Check if the JSON file exists after script execution
    if (fs.existsSync(outputFilePath)) {
      // Read the generated JSON file
      fs.readFile(outputFilePath, 'utf-8', (err, data) => {
        if (err) {
          return res.status(500).json({ error: 'Error reading JSON file' });
        }

        try {
          const articles = JSON.parse(data); // Parse JSON data
          res.status(200).json(articles); // Send the parsed data as the response
        } catch (error) {
          res.status(500).json({ error: 'Error parsing JSON data' });
        }
      });
    } else {
      res.status(500).json({ error: 'JSON file not found after script execution' });
    }
  });
}
