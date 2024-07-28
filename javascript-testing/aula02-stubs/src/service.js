const https = require("https");
const { error, information } = require("./constants");

class Service {
  async makeRequest(url) {
    return new Promise((resolve, reject) => {
      https.get(url, (response) => {
        response.on("data", (data) => resolve(JSON.parse(data)));
        response.on("error", reject);
      });
    });
  }

  async getGameMinimumRequirement(gameId) {
    if (!gameId) {
      throw new Error(error.ID_NOT_PROVIDED);
    }

    if (isNaN(parseInt(gameId))) {
      throw new Error(error.ID_IS_NOT_NUMBER);
    }

    const url = `https://www.freetogame.com/api/game?id=${gameId}`;
    
    const { id, title, minimum_system_requirements } = await this.makeRequest(url);
    const { os, processor, memory, graphics, storage } = minimum_system_requirements;

    return {
      id,
      title,
      os: os ?? information.NO_INFORMATION_PROVIDED,
      processor: processor ?? information.NO_INFORMATION_PROVIDED,
      memory: memory ?? information.NO_INFORMATION_PROVIDED,
      graphics: graphics ?? information.NO_INFORMATION_PROVIDED,
      storage: storage ?? information.NO_INFORMATION_PROVIDED,
    };
  }
}

module.exports = Service;
