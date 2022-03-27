import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch'

import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async (req, res) => {
    try {
      // Get public image url from req query
      const imageUrl = req.query.image_url;
      if (!imageUrl) {
        throw Error();
      }
      // 01. Validate url
      const fetchResult = await fetch(imageUrl.toString(), { method: 'GET' });
      if(fetchResult.status !== 200) {
        throw Error();
      }
      // 02. Call filterImageFromURL(image_url) to filter the image
      const imagePath = await filterImageFromURL(imageUrl);
      // 03. Send the resulting file in the response
      res.sendFile(imagePath);
      // 04. Remove local file async after 5 miliseconds
      setTimeout(() => {
        deleteLocalFiles([imagePath]);
      }, 5000);
    } catch (error) {
        res.status(400).send({ 'msg': "The inputted URL is invalid, please check!"});
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();