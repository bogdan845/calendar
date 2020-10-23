class Home {
    constructor(title, image) {
        this.title = title;
        this.image = image;
        this.date = new Date()
    }

    showInfo() {
        return JSON.stringify({
            title: this.title,
            image: this.image,
            date: this.date.toJSON()
        }, null, 2)
    }

    upperTitle() {
        return this.title.toUpperCase()
    }
}


export default Home;