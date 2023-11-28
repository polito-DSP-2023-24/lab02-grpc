class Image{    
    constructor(imageId, filmId, name) {
        this.id = imageId;
        this.name = name;
        this.self =  "/api/films/public/" + filmId + '/images/' + imageId;
    }
}

module.exports = Image;
