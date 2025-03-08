const regex = /@([^/]+)\/(.+)/;
const baseURL = 'https://api.hive.blog';

/**
 * Extracts the username and postSlug from a given Hive URL.
 * 
 * This function uses a regular expression to match the username and post slug from a URL. It returns
 * an object containing the extracted values, or throws an error if the URL does not match the expected format.
 * 
 * @param {string} URL - The URL from which to extract the username and postSlug.
 * @throws {Error} Will throw an error if the URL does not match the expected format.
 * @returns {Object} An object containing `username` and `postSlug` extracted from the URL.
 * 
 * @example
 * const result = ExtractParams("https://peakd.com/hive-173286/@imx.center/gumeta-update-24h-timeframe-and-more");
 * console.log(result.username);  // "imx.center"
 * console.log(result.postSlug);  // "gumeta-update-24h-timeframe-and-more"
 */

export const ExtractParams = (URL) => {

  const match = URL.match(regex);

  let author, permlink;
  if (match) {
      author = match[1];
      permlink = match[2];
  } else {
    throw new Error(`URL ${URL} does not match the expected format.`);
  }

  return {author, permlink};
}

/**
 * Generic function to call Hive API methods
 * 
 * For reference to the `bridge.get_post` method, please refer to the official Hive API documentation:
 * @see https://developers.hive.io/apidefinitions/#bridge.get_post
 * 
 * @param {string} method - The Hive API method name (e.g., "bridge.get_blogpost")
 * @param {object} params - The parameters required for the API call
 * @returns {Promise<object>} - The API response data
 */

export const FetchHiveData = async (method, params) => {

  const requestBody = {
    jsonrpc: '2.0',
    method, // shorthand for method: method
    params, // same as above
    id: 1
  };

  return fetch(baseURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .catch(error => {
    console.error(`Error fetching ${method}:`, error);
    process.exit(1);
  });
}