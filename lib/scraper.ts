import axios from "axios";
import fs from "fs";

class RedditScraper {
  constructor(subreddit: string, type: string) {
    this.init(subreddit, type);
  }

  async init(subreddit: string, type: string) {
    try {
      const response = await axios.get(
        `https://www.reddit.com/r/${subreddit}/${type}.json?limit=100`
      );

      let posts = response.data.data.children;

      let imageUrls = posts
        .filter((post: any) => post.data.url.endsWith(".jpg"))
        .map((post: any) => post.data.url);

      for (let i = 0; i < imageUrls.length; i++) {
        let imageResponse = await axios.get(imageUrls[i], {
          responseType: "arraybuffer",
        });

        let imageData = Buffer.from(imageResponse.data, "binary");
        let name = this.renameImage(15);

        console.log(`Downloading ${imageUrls[i]} as ${name}.`);

        await fs.promises
          .mkdir("./tmp", { recursive: true })
          .catch(console.error);
        fs.writeFileSync(`./tmp/${name}.jpg`, imageData);
      }

      console.log(`Finished downloading ${imageUrls.length} images.`);
    } catch (error) {
      console.error(error);
    }
  }

  renameImage(length: number) {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export default RedditScraper;
