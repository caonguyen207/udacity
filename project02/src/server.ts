import { Request, Response } from 'express';
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
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get("/filteredimage", async (req: Request, res: Response) => {
    try {
      // Get public image url from req query
      const imageUrl: string = req.query.image_url as string;
      if (!imageUrl) {
        throw Error();
      }
      // 01. Validate url
      const fetchResult = await fetch(imageUrl.toString(), { method: 'GET' });
      if(fetchResult.status !== 200) {
        throw Error();
      }
      // 02. Call filterImageFromURL(image_url) to filter the image
      const imagePath: string = await filterImageFromURL(imageUrl);
      // 03. Send the resulting file in the response
      res.sendFile(imagePath);
      // 04. Remove local file async after 5 miliseconds
      setTimeout(() => {
        deleteLocalFiles([imagePath]);
      }, 5000);
    } catch {
        res.status(400).send({ 'msg': "The inputted URL is invalid, please check!"});
    }
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();